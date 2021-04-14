import { registerRoute, setDefaultHandler } from "workbox-routing";
import { NetworkOnly } from "workbox-strategies";
import { indexPath, omrsCacheName } from "./constants";

/**
 * Registers required Workbox routes used by the service worker to provide offline functionality.
 */
export function registerAllOmrsRoutes() {
  const networkOnly = new NetworkOnly();

  // Navigation requests are, when unresolvable via network (i.e. when offline), routed back
  // to the SPA's index (which should always be precached).
  // This ensures that the page loads correctly when a new navigation occurs to pages
  // like `/openmrs/spa/anything/nested`.
  registerRoute(
    ({ request }) => request.mode === "navigate",
    async (options) => {
      try {
        return await networkOnly.handle(options);
      } catch (e) {
        const cache = await caches.open(omrsCacheName);
        const response = await cache.match(indexPath);
        return response ?? Response.error();
      }
    }
  );

  // Fallback: Try resolving the request using the network by default and by cache as a fallback.
  // The fallback handler does not add anything to the cache!
  //
  // This ensures that:
  // a) precached files (like the app shell and files resolved from the importmap) are returned when offline.
  // b) anything else (e.g. API requests) is not cached.
  setDefaultHandler(async (params) => {
    try {
      return await networkOnly.handle(params);
    } catch (e) {
      return (
        (await caches.match(params.request, { cacheName: omrsCacheName })) ??
        Response.error()
      );
    }
  });
}
