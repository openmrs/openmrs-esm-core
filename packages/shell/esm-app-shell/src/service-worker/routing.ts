import { RouteHandlerCallbackOptions } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { getOrCreateDefaultRouter } from "workbox-routing/utils/getOrCreateDefaultRouter";
import { NetworkFirst, NetworkOnly } from "workbox-strategies";
import { indexUrl, omrsCacheName } from "./constants";
import { ServiceWorkerDb } from "./storage";
import { publishEvent } from "./event";
import { validMethods } from "workbox-routing/utils/constants";
import {
  hasOmrsNetworkFirstHeader,
  headersToObject,
  parseOmrsOfflineResponseBodyHeader,
  parseOmrsOfflineResponseStatusHeader,
} from "./http-header-utils";

const networkOnly = new NetworkOnly();
const networkFirst = new NetworkFirst({ cacheName: omrsCacheName });

/**
 * Registers required Workbox routes used by the service worker to provide offline functionality.
 */
export function registerAllOmrsRoutes() {
  // Navigation requests are, when unresolvable via network (i.e. when offline), routed back
  // to the SPA's index (which should always be precached).
  // This ensures that the page loads correctly when a new navigation occurs to pages
  // like `/openmrs/spa/anything/nested`.
  registerRoute(
    ({ request }) => request.mode === "navigate",
    navigationHandler
  );

  // Fallback routing behavior.
  // Checks if a dynamic route registration exists and, if so, handles it using a Network First approach.
  // Otherwise falls back to a NetworkOnly - CacheOnly behavior.
  //
  // The latter ensures that:
  // a) precached files (like the app shell and files resolved from the importmap) are returned when offline.
  // b) anything else (e.g. API requests) is not cached.
  const router = getOrCreateDefaultRouter();
  for (const method of validMethods) {
    router.setDefaultHandler(defaultHandler, method);
  }
}

async function navigationHandler(options: RouteHandlerCallbackOptions) {
  try {
    return await networkOnly.handle(options);
  } catch (e) {
    const cache = await caches.open(omrsCacheName);
    const response = await cache.match(indexUrl);
    return response ?? Response.error();
  }
}

async function defaultHandler(options: RouteHandlerCallbackOptions) {
  const useNetworkFirst = await shouldUseNetworkFirst(options);
  if (useNetworkFirst) {
    return await networkFirst.handle(options);
  } else {
    return await handleWithNetworkOnlyAndCacheFallback(options);
  }
}

async function shouldUseNetworkFirst({
  request,
  url,
}: RouteHandlerCallbackOptions) {
  if (request.method !== "GET") {
    // TODO: Evaluate whether this should take precedence over the custom strategy header below.
    return false;
  }

  if (hasOmrsNetworkFirstHeader(request.headers)) {
    return true;
  }

  const db = new ServiceWorkerDb();
  const allDynamicRouteRegistrations =
    await db.dynamicRouteRegistrations.toArray();
  const hasMatchingDynamicRoute = allDynamicRouteRegistrations.some((route) =>
    new RegExp(route.pattern).test(url.href)
  );
  return hasMatchingDynamicRoute;
}

async function handleWithNetworkOnlyAndCacheFallback(
  options: RouteHandlerCallbackOptions
) {
  const { request } = options;
  const requestClone = await request.clone(); // Clone to avoid errors when calling request.text() later.

  try {
    return await networkOnly.handle(options);
  } catch (e) {
    const cachedResponse = await caches.match(request, {
      cacheName: omrsCacheName,
    });

    if (cachedResponse) {
      return cachedResponse;
    }

    publishEvent({
      type: "networkRequestFailed",
      request: {
        url: request.url,
        method: request.method,
        body: await requestClone.text(),
        headers: headersToObject(request.headers),
      },
    });

    return new Response(parseOmrsOfflineResponseBodyHeader(request.headers), {
      status: parseOmrsOfflineResponseStatusHeader(request.headers),
    });
  }
}
