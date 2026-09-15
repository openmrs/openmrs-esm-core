/** @module @category Dynamic Loading */
'use strict';
import { dispatchToastShown, type ImportMap } from '@openmrs/esm-globals';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { getCurrentPageMap, getImportMapOverrideMap, resetImportMapOverrides } from './import-maps';

/**
 * @internal
 *
 * Transforms an ESM module name to a valid JS identifier
 *
 * @param name the name of a module
 * @returns An opaque, equivalent JS identifier for the module
 */
export function slugify(name: string) {
  return name.replace(/[\/\-@]/g, '_');
}

/**
 * Loads the named export from a named package. This might be used like:
 *
 * ```js
 * const { someComponent } = importDynamic("@openmrs/esm-template-app")
 * ```
 *
 * @param jsPackage The package to load the export from.
 * @param share Indicates the name of the shared module; this is an advanced feature if the package you are loading
 *   doesn't use the default OpenMRS shared module name "./start".
 * @param options Additional options to control loading this script.
 * @param options.importMap The import map to use to load the script. This is useful for situations where you're
 *   loading multiple scripts at a time, since it allows the calling code to supply an importMap, saving multiple
 *   calls to `getCurrentImportMap()`.
 * @param options.maxLoadingTime A positive integer representing the maximum number of milliseconds to wait for the
 *   script to load before the promise returned from this function will be rejected. Defaults to 600,000 milliseconds,
 *   i.e., 10 minutes.
 */
export async function importDynamic<T = any>(
  jsPackage: string,
  share: string = './start',
  options?: {
    importMap?: ImportMap;
    maxLoadingTime?: number;
  },
): Promise<T> {
  // default to 10 minutes
  const maxLoadingTime = !options?.maxLoadingTime || options.maxLoadingTime <= 0 ? 600_000 : options.maxLoadingTime;

  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
  await Promise.race([
    preloadImport(jsPackage, options?.importMap),
    new Promise((_, reject) => {
      timeout = setTimeout(() => {
        reject(
          new Error(`Could not resolve requested script, ${jsPackage}, within ${humanReadableMs(maxLoadingTime)}.`),
        );
      }, maxLoadingTime);
    }),
  ]);

  if (timeout) {
    clearTimeout(timeout);
  }

  const jsPackageSlug = slugify(jsPackage);

  const container = window[jsPackageSlug] as unknown;
  if (!isFederatedModule(container)) {
    const error = `The global variable ${jsPackageSlug} does not refer to a federated module`;
    console.error(error);
    throw new Error(error);
  }

  container.init(__webpack_share_scopes__.default);

  const factory = await container.get(share);
  const module = factory();

  if (!(typeof module === 'object') || module === null) {
    const error = `Container for ${jsPackage} did not return an ESM module as expected`;
    console.error(error);
    throw new Error(error);
  }

  return module as unknown as T;
}

/**
 * Utility function to convert milliseconds into human-readable strings with rather absurd
 * levels of precision.
 *
 * @param ms Number of milliseconds
 * @returns A human-readable string useful only for error logging, where we can assume English
 */
function humanReadableMs(ms: number) {
  if (ms < 1_000) {
    return `${ms} milliseconds`;
  } else if (ms < 60_000) {
    return `${Math.floor(ms / 1000)} seconds`;
  } else if (ms < 3_600_000) {
    return `${Math.floor(ms / 60_000)} minutes`;
  } else if (ms < 86_400_000) {
    return `${Math.floor(ms / 3_600_000)} hours`;
  } else {
    return `${Math.floor(ms / 86_400_000)} days`;
  }
}

/**
 * @internal
 *
 * This internal method is used to ensure that the script belonging
 * to the given package is loaded and added to the head. Concurrent and
 * repeat calls for the same package share a single request for it.
 *
 * @param jsPackage The package to load
 * @param importMap The import map to use for loading this package.
 *  The main reason for specifying this is to avoid needing to call
 *  `getCurrentPageMap()` for every script when bulk loading.
 */
export async function preloadImport(jsPackage: string, importMap?: ImportMap) {
  if (typeof jsPackage !== 'string' || jsPackage.trim().length === 0) {
    const error = 'Attempted to call importDynamic() without supplying a package to load';
    console.error(error);
    throw new Error(error);
  }

  const jsPackageSlug = slugify(jsPackage);

  if (!window[jsPackageSlug]) {
    const activeImportMap = importMap ?? (await getCurrentImportMap());
    if (!activeImportMap.imports.hasOwnProperty(jsPackage)) {
      const error = `Could not find the package ${jsPackage} defined in the current importmap`;
      console.error(error);
      throw new Error(error);
    }

    let url = activeImportMap.imports[jsPackage];
    if (url.startsWith('./')) {
      url = window.spaBase + url.substring(1);
    }

    const isOverridden = jsPackage in getImportMapOverrideMap().imports;
    try {
      return await loadScript(url);
    } catch (err: any) {
      if (isOverridden) {
        dispatchToastShown({
          kind: 'error',
          title: getCoreTranslation('scriptLoadingFailed', 'Error: Script failed to load'),
          description: getCoreTranslation(
            'scriptLoadingError',
            'Failed to load overridden script from {{- url}}. Please check that the bundled script is available at the expected URL. Click the button below to reset all import map overrides.',
            {
              url,
            },
          ),
          actionButtonLabel: getCoreTranslation('resetOverrides', 'Reset overrides'),
          onActionButtonClick() {
            resetImportMapOverrides();
            window.location.reload();
          },
        });
      }

      return Promise.reject(err);
    }
  }

  return Promise.resolve();
}

/**
 * @internal
 *
 * Used to load the current import map.
 *
 * @returns The current import map.
 */
export async function getCurrentImportMap() {
  return getCurrentPageMap();
}

interface FederatedModule {
  init: (scope: typeof __webpack_share_scopes__.default) => void;
  get: (_export: string) => Promise<() => unknown>;
}

function isFederatedModule(a: unknown): a is FederatedModule {
  return (
    typeof a === 'object' &&
    a !== null &&
    'init' in a &&
    typeof a['init'] === 'function' &&
    'get' in a &&
    typeof a['get'] === 'function'
  );
}

// internals to track script loading

// if we're already loading a script, we should wait until the script is loaded
// we use a global to track this; we use `Symbol.for()` in case this gets loaded
// twice
const OPENMRS_SCRIPT_LOADING = Symbol.for('__openmrs_script_loading');

/**
 * The scripts this loader has requested, keyed by URL. A pending entry is in flight and a settled
 * one has loaded; failed requests are removed, so any entry can be awaited rather than re-requested.
 */
function getScriptRegistry(): Map<string, Promise<void>> {
  return (window[OPENMRS_SCRIPT_LOADING] ??= new Map<string, Promise<void>>());
}

/**
 * Appends a `<script>` to the DOM with the given URL, unless it has been requested already, and
 * resolves once it has loaded. Callers arriving at any point in a script's lifecycle share one
 * request for it.
 *
 * A script which fails loading is removed from the DOM and can be retried. A script which throws
 * when loading, however, will remain in the DOM as the script loaded.
 */
function loadScript(url: string): Promise<void> {
  const registry = getScriptRegistry();

  const requested = registry.get(url);
  if (requested) {
    return requested;
  }

  if (document.head.querySelector(`script[src="${url}"]`)) {
    // something other than this loader put the script in the document, so assume it's usable
    console.warn(`Script at ${url} already loaded. Not loading it again.`);
    return Promise.resolve();
  }

  const element = document.createElement('script');
  element.src = url;
  element.type = 'text/javascript';
  element.async = true;

  const request = new Promise<void>((resolve, reject) => {
    // displays an error if a script takes more than 5 seconds to load
    const loadTimeout = setTimeout(() => {
      console.error(
        `The script at ${url} did not load within 5 seconds. This may indicate an issue with the imports in the script's entry-point file or with the script's bundler configuration.`,
      );
    }, 5_000); // 5 seconds; this is arbitrary

    function finishScriptLoading() {
      clearTimeout(loadTimeout);
      element.removeEventListener('load', loadFn);
      element.removeEventListener('error', errFn);
    }

    function loadFn() {
      finishScriptLoading();
      resolve();
    }

    function errFn(ev: ErrorEvent) {
      finishScriptLoading();
      registry.delete(url);
      element.remove();
      const msg = `Failed to load script from ${url}`;
      console.error(msg, ev);
      reject(ev.message ?? msg);
    }

    element.addEventListener('load', loadFn);
    element.addEventListener('error', errFn);

    document.head.appendChild(element);
  });

  registry.set(url, request);
  return request;
}
