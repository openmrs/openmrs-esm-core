import { ImportMap, retry } from "@openmrs/esm-framework";
import { absoluteWbManifestUrls, omrsCacheName } from "./constants";
import { fetchUrlsToCacheFromImportMap } from "./importMapUtils";
import { ServiceWorkerDb } from "./storage";

/**
 * Attempts to resolve cacheable files from the specified import map (files are retrieved via convention)
 * and, if successful, attempts to add them to the app cache.
 * @param importMap An import map object from which cacheable files should be extracted.
 */
export async function cacheImportMapReferences(importMap: ImportMap) {
  const urlsToCache = await fetchUrlsToCacheFromImportMap(importMap);
  await invalidateObsoleteCacheEntries(urlsToCache);
  await addToOmrsCache(urlsToCache);
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
  if (urls.length === 0) {
    return;
  }

  const addToCache = async () => {
    const cache = await caches.open(omrsCacheName);
    await cache.addAll(urls);
  };

  await retry(addToCache, {
    onError: (e, attempt) =>
      console.warn(
        `Adding the following URLs to the cache failed. Retry attempt: ${attempt}.`,
        urls,
        e
      ),
  });
}

async function invalidateObsoleteCacheEntries(newImportMapUrls: Array<string>) {
  const cache = await caches.open(omrsCacheName);
  const cachedUrls = (await cache.keys()).map((x) => x.url);
  const dynamicRoutes =
    await new ServiceWorkerDb().dynamicRouteRegistrations.toArray();
  const urlsToInvalidate = cachedUrls.filter(
    (cachedUrl) =>
      !absoluteWbManifestUrls.includes(cachedUrl) &&
      !newImportMapUrls.includes(cachedUrl) &&
      !dynamicRoutes.some((route) => new RegExp(route.pattern).test(cachedUrl))
  );

  console.info(
    "Removing the following expired URLs from the cache: ",
    urlsToInvalidate
  );

  // eslint-disable-next-line no-console
  console.debug(
    "The following URLs were known and not invalidated: ",
    absoluteWbManifestUrls,
    newImportMapUrls,
    dynamicRoutes
  );

  await Promise.all(urlsToInvalidate.map((url) => cache.delete(url)));
}
