/* eslint-disable no-console */
import type { ImportMap } from "@openmrs/esm-globals";
import { retry } from "@openmrs/esm-utils";
import { absoluteWbManifestUrls, omrsCacheName } from "./constants";
import { fetchUrlsToCacheFromImportMap } from "./import-map-utils";
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

  // The following doesn't simply use cache.addAll because it aborts on the first failure.
  // We want to cache as much as possible and just because, e.g., one single MF cannot be cached
  // we don't want the rest to fail.
  // It further allows us to log more granularly *which* URL couldn't be cached, so debugging
  // is easier.
  const cache = await caches.open(omrsCacheName);
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        await retry(() => cache.add(url), {
          onError: (e, attempt) =>
            console.debug(
              `[SW] Failure attempt ${attempt} at caching "${url}". Error: `,
              e
            ),
        });
        return { url, success: true };
      } catch (e) {
        return { url, success: false };
      }
    })
  );

  const cached = results.filter((r) => r.success);
  const failedToCache = results.filter((r) => !r.success);

  if (cached.length > 0) {
    console.debug(
      `[SW] Successfully added ${cached.length} URLs to the OMRS cache. URLs: `,
      cached.map((r) => r.url)
    );
  }

  if (failedToCache.length > 0) {
    console.error(
      `[SW] Failed to cache ${failedToCache.length} URLs. URLs: `,
      failedToCache.map((r) => r.url)
    );
  }
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
    "[SW] Removing the following expired URLs from the cache: ",
    urlsToInvalidate
  );

  // eslint-disable-next-line no-console
  console.debug(
    "[SW] The following URLs were known and not invalidated: ",
    absoluteWbManifestUrls,
    newImportMapUrls,
    dynamicRoutes
  );

  await Promise.all(urlsToInvalidate.map((url) => cache.delete(url)));
}
