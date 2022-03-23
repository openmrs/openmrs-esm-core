import { setCacheNameDetails } from "workbox-core";
import { handleMessage } from "./message";
import { precacheAppShell } from "./caching";
import { registerAllOmrsRoutes } from "./routing";
import { omrsCachePrefix } from "./constants";

self.__WB_DISABLE_DEV_LOGS = true;

// Initial Workbox setup. Renaming its default cache prefix prevents conflicts with other dev envs on localhost.
setCacheNameDetails({ prefix: omrsCachePrefix });

registerAllOmrsRoutes();

self.addEventListener("message", handleMessage);

self.addEventListener("install", (e) => {
  self.skipWaiting();

  // The app shell files are special in the sense that they can immediately be cached during SW installation.
  // They also don't change in between builds which makes them safe to cache once only.
  // If they change *during* a build, the SW is updated as well which triggers a re-installation.
  e.waitUntil(precacheAppShell());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
