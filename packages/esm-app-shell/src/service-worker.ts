import { precacheAndRoute } from "workbox-precaching";
import { PrecacheEntry } from "workbox-precaching/_types";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

declare global {
  interface Window {
    __WB_MANIFEST: Array<string | PrecacheEntry>;
  }
}

const wbManifest = self.__WB_MANIFEST;
precacheAndRoute(wbManifest);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({ cacheName: "images" })
);
