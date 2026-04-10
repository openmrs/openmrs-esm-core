/** @module @category Import Map */
import type { ImportMap } from '@openmrs/esm-globals';

const OVERRIDE_PREFIX = 'import-map-override:';
const DISABLED_KEY = 'import-map-overrides-disabled';
const CHANGE_EVENT = 'import-map-overrides:change';

// Set by setupImportMapOverrides(); controls whether override functionality is active.
let devMode = false;

// Snapshot of overrides at setup time (matches import-map-overrides library behavior:
// getCurrentPageMap returns the overrides as they were when the page loaded).
let initialOverrideSnapshot: ImportMap | null = null;

/**
 * Reads all `<script type="systemjs-importmap">` tags from the DOM and merges
 * them into a single {@link ImportMap}. Tags with a `src` attribute are fetched;
 * inline tags have their `textContent` parsed as JSON.
 */
async function readBaseMap(): Promise<ImportMap> {
  const scripts = document.querySelectorAll<HTMLScriptElement>('script[type="systemjs-importmap"]');
  const maps: ImportMap[] = [];

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    try {
      if (script.src) {
        const response = await fetch(script.src);
        maps.push(await response.json());
      } else if (script.textContent) {
        maps.push(JSON.parse(script.textContent));
      }
    } catch (e) {
      console.warn(`[import-maps] Failed to parse import map from script tag at index ${i}`, e);
    }
  }

  return mergeMaps(maps);
}

function mergeMaps(maps: ImportMap[]): ImportMap {
  const merged: ImportMap = { imports: {} };
  for (const map of maps) {
    if (map?.imports) {
      Object.assign(merged.imports, map.imports);
    }
  }
  return merged;
}

/** Returns all `import-map-override:*` entries from localStorage as an {@link ImportMap}. */
function readOverrideMap(): ImportMap {
  const imports: Record<string, string> = {};

  try {
    const disabled = getImportMapDisabledOverrides();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(OVERRIDE_PREFIX)) {
        const moduleName = key.slice(OVERRIDE_PREFIX.length);
        if (!disabled.includes(moduleName)) {
          const url = localStorage.getItem(key);
          if (url) {
            imports[moduleName] = url;
          }
        }
      }
    }
  } catch (e) {
    console.warn('[import-maps] Failed to read import-map overrides from localStorage', e);
  }

  return { imports };
}

/**
 * Returns the import map for the current page. In dev mode, this merges
 * the base map with the override snapshot captured at page load.
 */
export async function getCurrentPageMap(): Promise<ImportMap> {
  const base = await readBaseMap();
  if (!devMode) {
    return base;
  }
  const overrides = initialOverrideSnapshot ?? readOverrideMap();
  return mergeMaps([base, overrides]);
}

/**
 * Returns the base import map from the DOM without any overrides applied.
 */
export async function getImportMapDefaultMap(): Promise<ImportMap> {
  return readBaseMap();
}

/**
 * Returns what the import map will look like on the next page load, including
 * any overrides that have been added/removed since the page loaded.
 * In production, this is the same as the base map.
 */
export async function getImportMapNextPageMap(): Promise<ImportMap> {
  if (!devMode) {
    return readBaseMap();
  }
  const base = await readBaseMap();
  return mergeMaps([base, readOverrideMap()]);
}

/**
 * Returns the current override map. In production, returns empty imports.
 * @param includeDisabled If true, includes disabled overrides.
 */
export function getImportMapOverrideMap(includeDisabled?: boolean): ImportMap {
  if (!devMode) {
    return { imports: {} };
  }

  if (includeDisabled) {
    const imports: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(OVERRIDE_PREFIX)) {
        const url = localStorage.getItem(key);
        if (url) {
          imports[key.slice(OVERRIDE_PREFIX.length)] = url;
        }
      }
    }
    return { imports };
  }
  return readOverrideMap();
}

/**
 * Returns the list of module names whose overrides are disabled.
 * In production, returns an empty array.
 */
export function getImportMapDisabledOverrides(): string[] {
  if (!devMode) {
    return [];
  }

  try {
    const raw = localStorage.getItem(DISABLED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore malformed data
  }
  return [];
}

/**
 * Returns whether the given module's override is disabled.
 * In production, returns false.
 */
export function isImportMapOverrideDisabled(moduleName: string): boolean {
  if (!devMode) {
    return false;
  }
  return getImportMapDisabledOverrides().includes(moduleName);
}

/**
 * Adds an import map override. In production, this is a no-op.
 */
export function addImportMapOverride(name: string, url: string): void {
  if (!devMode) {
    console.warn('[Security] Import map overrides are disabled in production mode.');
    return;
  }
  localStorage.setItem(OVERRIDE_PREFIX + name, url);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/**
 * Removes an import map override. In production, this is a no-op.
 */
export function removeImportMapOverride(name: string): void {
  if (!devMode) {
    console.warn('[Security] Import map overrides are disabled in production mode.');
    return;
  }
  localStorage.removeItem(OVERRIDE_PREFIX + name);
  const disabled = getImportMapDisabledOverrides().filter((n) => n !== name);
  if (disabled.length > 0) {
    localStorage.setItem(DISABLED_KEY, JSON.stringify(disabled));
  } else {
    localStorage.removeItem(DISABLED_KEY);
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/**
 * Clears all import map overrides. In production, this is a no-op.
 */
export function resetImportMapOverrides(): void {
  if (!devMode) {
    console.warn('[Security] Import map overrides are disabled in production mode.');
    return;
  }
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(OVERRIDE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem(DISABLED_KEY);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/**
 * Re-enables a previously disabled import map override. In production, this is a no-op.
 */
export function enableImportMapOverride(name: string): void {
  if (!devMode) {
    console.warn('[Security] Import map overrides are disabled in production mode.');
    return;
  }
  const disabled = getImportMapDisabledOverrides().filter((n) => n !== name);
  if (disabled.length > 0) {
    localStorage.setItem(DISABLED_KEY, JSON.stringify(disabled));
  } else {
    localStorage.removeItem(DISABLED_KEY);
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/**
 * Initializes the import map override system with mode-aware behavior.
 *
 * In production (`window.spaEnv !== 'development'`), mutation functions are
 * no-ops and localStorage overrides are never consulted. In development, the
 * full override workflow is available.
 *
 * Must be called before any code that depends on the import map functions.
 */
export function setupImportMapOverrides() {
  devMode = window.spaEnv === 'development';

  if (devMode) {
    initialOverrideSnapshot = readOverrideMap();
  }
}
