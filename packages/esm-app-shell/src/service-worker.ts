import { PrecacheEntry } from "workbox-precaching/_types";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { setCacheNameDetails } from "workbox-core";

declare global {
  interface Window {
    __WB_MANIFEST: Array<PrecacheEntry>;
  }
}

const indexPath = prefixWithSpaBase("index.html");
const wbManifest = self.__WB_MANIFEST;
const absoluteWbManifestUrls = wbManifest.map(({ url }) =>
  prefixWithSpaBase(url)
);
const omrsCachePrefix = "omrs";
const omrsCacheName = `${omrsCachePrefix}-cache`;
const omrsNetworkFirst = new NetworkFirst({ cacheName: omrsCacheName });

setCacheNameDetails({ prefix: omrsCachePrefix });

self.addEventListener("install", (e) => {
  const precacheAppFiles = async () => {
    const cache = await caches.open(omrsCacheName);
    await cache.addAll(absoluteWbManifestUrls);
  };

  e.waitUntil(precacheAppFiles());
});

registerRoute(
  ({ url }) => absoluteWbManifestUrls.includes(url.href),
  omrsNetworkFirst
);

registerRoute(
  ({ request }) => request.mode === "navigate",
  async (options) => {
    try {
      return await omrsNetworkFirst.handle(options);
    } catch (e) {
      const cache = await caches.open(omrsCacheName);
      const response = await cache.match(indexPath);
      return response ?? Response.error();
    }
  }
);

function prefixWithSpaBase(path: string) {
  return new URL(path, self.location.href).href;
}
