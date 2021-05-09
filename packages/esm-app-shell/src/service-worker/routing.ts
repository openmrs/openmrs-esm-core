import { RouteHandlerCallbackOptions } from "workbox-core";
import { registerRoute, setDefaultHandler } from "workbox-routing";
import { NetworkFirst, NetworkOnly } from "workbox-strategies";
import { indexUrl, omrsCacheName } from "./constants";
import { ServiceWorkerDb } from "./storage";
import { publishEvent } from "./event";

/**
 * Registers required Workbox routes used by the service worker to provide offline functionality.
 */
export function registerAllOmrsRoutes() {
  const networkOnly = new NetworkOnly();
  const networkFirst = new NetworkFirst({ cacheName: omrsCacheName });

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
        const response = await cache.match(indexUrl);
        return response ?? Response.error();
      }
    }
  );

  // Fallback routing behavior.
  // Checks if a dynamic route registration exists and, if so, handles it using a Network First approach.
  // Otherwise falls back to a NetworkOnly - CacheOnly behavior.
  //
  // The latter ensures that:
  // a) precached files (like the app shell and files resolved from the importmap) are returned when offline.
  // b) anything else (e.g. API requests) is not cached.
  setDefaultHandler(async (options) => {
    const db = new ServiceWorkerDb();
    const allDynamicRouteRegistrations =
      await db.dynamicRouteRegistrations.toArray();
    const hasMatchingDynamicRoute = allDynamicRouteRegistrations.some((route) =>
      new RegExp(route.pattern).test(options.url.href)
    );

    if (hasMatchingDynamicRoute && options.request.method === "GET") {
      return await handleCacheableGetRequest(options);
    } else {
      return await handleUncacheableRequest(options);
    }
  });

  async function handleCacheableGetRequest(
    options: RouteHandlerCallbackOptions
  ) {
    return await networkFirst.handle(options);
  }

  async function handleUncacheableRequest(
    options: RouteHandlerCallbackOptions
  ) {
    try {
      return await networkOnly.handle(options);
    } catch (e) {
      const cachedResponse = await caches.match(options.request, {
        cacheName: omrsCacheName,
      });
      if (cachedResponse) {
        return cachedResponse;
      }

      publishEvent({
        type: "networkRequestFailed",
        request: {
          url: options.request.url,
          method: options.request.method,
          body: await options.request.text(),
          headers: Object.fromEntries(Object.entries(options.request.headers)),
        },
      });

      return Response.error();
    }
  }
}
