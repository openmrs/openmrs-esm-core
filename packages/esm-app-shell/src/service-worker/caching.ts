import { setCacheNameDetails } from "workbox-core";

export const omrsCachePrefix = "omrs";
export const omrsCacheName = `${omrsCachePrefix}-spa-cache-v1`;

// Initial Workbox setup. Renaming its default cache prefix prevents conflicts with other dev envs on localhost.
setCacheNameDetails({ prefix: omrsCachePrefix });

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
