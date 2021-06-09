import { RouteHandlerCallbackOptions } from "workbox-core";
import { registerRoute, setDefaultHandler } from "workbox-routing";
import { getOrCreateDefaultRouter } from "workbox-routing/utils/getOrCreateDefaultRouter";
import { NetworkFirst, NetworkOnly } from "workbox-strategies";
import { indexUrl, omrsCacheName } from "./constants";
import { ServiceWorkerDb } from "./storage";
import { publishEvent } from "./event";
import { validMethods } from "workbox-routing/utils/constants";

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
    ({ request }) => {
      return request.mode === "navigate";
    },
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
  const defaultHandler = async (options: RouteHandlerCallbackOptions) => {
    const requestClone = options.request.clone();
    const db = new ServiceWorkerDb();
    const allDynamicRouteRegistrations =
      await db.dynamicRouteRegistrations.toArray();
    const hasMatchingDynamicRoute = allDynamicRouteRegistrations.some((route) =>
      new RegExp(route.pattern).test(options.url.href)
    );

    if (hasMatchingDynamicRoute && options.request.method === "GET") {
      return await networkFirst.handle(options);
    } else {
      try {
        return await networkOnly.handle(options);
      } catch (e) {
        const cachedResponse = await caches.match(options.request, {
          cacheName: omrsCacheName,
        });

        if (cachedResponse) {
          return cachedResponse;
        }

        const headers = {};
        options.request.headers.forEach((value, key) => (headers[key] = value));

        publishEvent({
          type: "networkRequestFailed",
          request: {
            url: options.request.url,
            method: options.request.method,
            body: await requestClone.text(),
            headers,
          },
        });

        const offlineResponse = createOfflineResponse(options.request.headers);
        return new Response(offlineResponse.body, {
          status: offlineResponse.status,
        });
      }
    }
  };

  const router = getOrCreateDefaultRouter();
  for (const method of validMethods) {
    router.setDefaultHandler(defaultHandler, method);
  }
}

function createOfflineResponse(headers: Headers) {
  const body = headers.get("x-omrs-offline-response-body");
  const status = +(headers.get("x-omrs-offline-response-status") ?? "");
  return {
    body: body ?? undefined,
    status: isNaN(status) || status < 200 || status > 599 ? 503 : status,
  };
}
