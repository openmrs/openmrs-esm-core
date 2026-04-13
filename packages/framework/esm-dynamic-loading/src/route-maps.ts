/** @module @category Route Map */
import type { OpenmrsAppRoutes, OpenmrsRoutes } from '@openmrs/esm-globals';
import { isOpenmrsAppRoutes, isOpenmrsRoutes } from '@openmrs/esm-globals';

const OVERRIDE_PREFIX = 'openmrs-routes:';
const CHANGE_EVENT = 'openmrs-routes:change';

// Set by setupRouteMapOverrides(); controls whether override functionality is active.
let devMode = false;

// Snapshot of overrides at setup time (mirrors the import-map-overrides pattern:
// getCurrentRouteMap returns the overrides as they were when the page loaded).
let initialOverrideSnapshot: OpenmrsRoutes | null = null;

/**
 * Reads all `<script type="openmrs-routes">` tags from the DOM and merges
 * them into a single {@link OpenmrsRoutes} object. Tags with a `src` attribute
 * are fetched; inline tags have their `textContent` parsed as JSON.
 */
async function readBaseMap(): Promise<OpenmrsRoutes> {
  const scripts = document.querySelectorAll<HTMLScriptElement>("script[type='openmrs-routes']");
  const maps: OpenmrsRoutes[] = [];

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    try {
      let parsed: unknown;
      if (script.src) {
        const response = await fetch(script.src);
        parsed = await response.json();
      } else if (script.textContent) {
        parsed = JSON.parse(script.textContent);
      }

      if (parsed && isOpenmrsRoutes(parsed)) {
        maps.push(parsed);
      }
    } catch (e) {
      console.warn(`[route-maps] Failed to parse routes from script tag at index ${i}`, e);
    }
  }

  return mergeRouteMaps(maps);
}

function mergeRouteMaps(maps: OpenmrsRoutes[]): OpenmrsRoutes {
  const merged: OpenmrsRoutes = {};
  for (const map of maps) {
    if (map && typeof map === 'object') {
      Object.assign(merged, map);
    }
  }
  return merged;
}

/**
 * Reads all `openmrs-routes:*` entries from localStorage as an {@link OpenmrsRoutes}.
 * This is async because URL-valued overrides need to be fetched.
 */
async function readOverrideMap(): Promise<OpenmrsRoutes> {
  const result: OpenmrsRoutes = {};

  try {
    const entries: Array<{ moduleName: string; raw: string }> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(OVERRIDE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          entries.push({ moduleName: key.slice(OVERRIDE_PREFIX.length), raw });
        }
      }
    }

    const settled = await Promise.allSettled(
      entries.map(async ({ moduleName, raw }) => {
        const parsed = JSON.parse(raw);

        if (isOpenmrsAppRoutes(parsed)) {
          return { moduleName, routes: parsed };
        }

        if (typeof parsed === 'string' && parsed.startsWith('http')) {
          const response = await fetch(parsed);
          const fetched: unknown = await response.json();
          if (isOpenmrsAppRoutes(fetched)) {
            return { moduleName, routes: fetched };
          }
          throw new Error(`${parsed} did not resolve to a valid OpenmrsAppRoutes object`);
        }

        throw new Error(`Override for ${moduleName} is neither a valid routes object nor a URL`);
      }),
    );

    for (const entry of settled) {
      if (entry.status === 'fulfilled') {
        result[entry.value.moduleName] = entry.value.routes;
      } else {
        console.warn('[route-maps] Failed to load route override', entry.reason);
      }
    }
  } catch (e) {
    console.warn('[route-maps] Failed to read route overrides from localStorage', e);
  }

  return result;
}

/**
 * Returns the route map for the current page. In dev mode, this merges
 * the base map with the override snapshot captured at page load.
 */
export async function getCurrentRouteMap(): Promise<OpenmrsRoutes> {
  const base = await readBaseMap();
  if (!devMode) {
    return base;
  }
  const overrides = initialOverrideSnapshot ?? (await readOverrideMap());
  return mergeRouteMaps([base, overrides]);
}

/**
 * Returns the base route map from the DOM without any overrides applied.
 */
export async function getRouteMapDefaultMap(): Promise<OpenmrsRoutes> {
  return readBaseMap();
}

/**
 * Returns what the route map will look like on the next page load, including
 * any overrides that have been added/removed since the page loaded.
 * In production, this is the same as the base map.
 */
export async function getRouteMapNextPageMap(): Promise<OpenmrsRoutes> {
  if (!devMode) {
    return readBaseMap();
  }
  const base = await readBaseMap();
  return mergeRouteMaps([base, await readOverrideMap()]);
}

/**
 * Returns the current raw override entries from localStorage.
 * In production, returns an empty object.
 */
export function getRouteMapOverrideMap(): Record<string, string> {
  if (!devMode) {
    return {};
  }

  const result: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(OVERRIDE_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          result[key.slice(OVERRIDE_PREFIX.length)] = value;
        }
      }
    }
  } catch (e) {
    console.warn('[route-maps] Failed to read route overrides from localStorage', e);
  }
  return result;
}

/**
 * Adds a route override. In production, this is a no-op.
 * The app must be reloaded for overrides to take effect.
 *
 * @param moduleName The name of the module the routes are for
 * @param routes Either an {@link OpenmrsAppRoutes} object, a string that represents a JSON
 *  version of an {@link OpenmrsAppRoutes} object, or a string or URL that resolves to a
 *  JSON document that represents an {@link OpenmrsAppRoutes} object
 */
export function addRouteMapOverride(moduleName: string, routes: OpenmrsAppRoutes | string | URL) {
  if (!devMode) {
    console.warn('[Security] Route overrides are disabled outside development mode.');
    return;
  }

  try {
    if (typeof routes === 'string') {
      if (routes.startsWith('http')) {
        localStorage.setItem(OVERRIDE_PREFIX + moduleName, JSON.stringify(routes));
      } else {
        const maybeRoutes = JSON.parse(routes);
        if (isOpenmrsAppRoutes(maybeRoutes)) {
          localStorage.setItem(OVERRIDE_PREFIX + moduleName, JSON.stringify(maybeRoutes));
        } else {
          console.error(`The supplied routes for ${moduleName} is not a valid OpenmrsAppRoutes object`, routes);
          return;
        }
      }
    } else if (routes instanceof URL) {
      localStorage.setItem(OVERRIDE_PREFIX + moduleName, JSON.stringify(routes.toString()));
    } else if (isOpenmrsAppRoutes(routes)) {
      localStorage.setItem(OVERRIDE_PREFIX + moduleName, JSON.stringify(routes));
    } else {
      console.error(
        `Override for ${moduleName} is not in a valid format. Expected either a Javascript Object, a JSON string of a Javascript object, or a URL`,
        routes,
      );
      return;
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch (e) {
    console.warn('[route-maps] Failed to write route override to localStorage', e);
  }
}

/**
 * Removes a route override. In production, this is a no-op.
 * The app must be reloaded for the removal to take effect.
 *
 * @param moduleName The module to remove the overrides for
 */
export function removeRouteMapOverride(moduleName: string) {
  if (!devMode) {
    console.warn('[Security] Route overrides are disabled outside development mode.');
    return;
  }

  try {
    localStorage.removeItem(OVERRIDE_PREFIX + moduleName);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch (e) {
    console.warn('[route-maps] Failed to remove route override from localStorage', e);
  }
}

/**
 * Clears all route overrides. In production, this is a no-op.
 * The app must be reloaded for the removal to take effect.
 */
export function resetRouteMapOverrides() {
  if (!devMode) {
    console.warn('[Security] Route overrides are disabled outside development mode.');
    return;
  }

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(OVERRIDE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch (e) {
    console.warn('[route-maps] Failed to clear route overrides from localStorage', e);
  }
}

/**
 * Initializes the route map override system with mode-aware behavior.
 *
 * In production (`window.spaEnv !== 'development'`), mutation functions are
 * no-ops and localStorage overrides are never consulted. In development, the
 * full override workflow is available.
 *
 * Must be called before any code that depends on the route map functions.
 */
let setupPromise: Promise<void> | null = null;

export function setupRouteMapOverrides(): Promise<void> {
  if (setupPromise) {
    return setupPromise;
  }

  devMode = window.spaEnv === 'development';

  if (devMode) {
    setupPromise = readOverrideMap().then((snapshot) => {
      initialOverrideSnapshot = snapshot;
    });
  } else {
    setupPromise = Promise.resolve();
  }

  return setupPromise;
}
