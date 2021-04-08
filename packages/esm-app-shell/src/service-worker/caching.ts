import { ImportMap } from "@openmrs/esm-globals";
import { absoluteWbManifestUrls, omrsCacheName } from "./constants";
import { fetchUrlsToCacheFromImportMap } from "./importMapUtils";

/**
 * Attempts to resolve cacheable files from the specified import map (files are retrieved via convention)
 * and, if successful, attempts to add them to the app cache.
 * @param importMap An import map object from which cacheable files should be extracted.
 */
export async function cacheImportMapReferences(importMap: ImportMap) {
  const urlsToCache = await fetchUrlsToCacheFromImportMap(importMap);
  return await addToOmrsCache(urlsToCache);
}

/**
 * Adds all static app shell files to the cache.
 * Only caches the "raw" app shell, not any MFs/any data coming from an import map.
 */
export function precacheAppShell() {
  return addToOmrsCache(absoluteWbManifestUrls);
}

/**
 * Adds all of the given urls to the default app cache.
 * @param urls An array of URLs to be cached.
 */
export async function addToOmrsCache(urls: Array<string>) {
  if (urls.length == 0) {
    return;
  }

  const cache = await caches.open(omrsCacheName);
  await cache.addAll(urls);
}
