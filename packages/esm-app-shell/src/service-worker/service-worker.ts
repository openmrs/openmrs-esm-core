import "./types";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { setCacheNameDetails } from "workbox-core";
import { distinct } from "../helpers";
import { onMessage } from "./message";
import { addToOmrsCache, omrsCacheName, omrsCachePrefix } from "./caching";

self.addEventListener("message", onMessage);

const indexPath = prefixWithSpaBase("index.html");
const wbManifest = self.__WB_MANIFEST;
const absoluteWbManifestUrls = distinct(
  wbManifest.map(({ url }) => prefixWithSpaBase(url))
);
const omrsNetworkFirst = new NetworkFirst({ cacheName: omrsCacheName });

setCacheNameDetails({ prefix: omrsCachePrefix });

self.addEventListener("install", (e) => {
  e.waitUntil(addToOmrsCache(absoluteWbManifestUrls));
});

registerRoute(
  ({ url }) => absoluteWbManifestUrls.includes(url.href),
  omrsNetworkFirst
);

registerRoute(/.*localhost:8081.*/, omrsNetworkFirst);

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
