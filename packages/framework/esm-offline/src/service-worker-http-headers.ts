/** @module @category Offline */

export const omrsOfflineResponseBodyHttpHeaderName =
  "x-omrs-offline-response-body";
export const omrsOfflineResponseStatusHttpHeaderName =
  "x-omrs-offline-response-status";
export const omrsOfflineCachingStrategyHttpHeaderName =
  "x-omrs-offline-caching-strategy";

/**
 *
 *
 * * `cache-or-network`: The default strategy, equal to the absence of this header.
 *   The SW attempts to resolve the request via the network, but falls back to the cache if required.
 *   The service worker decides the strategy to be used.
 * * `network-first`: See https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_first_network_falling_back_to_cache.
 */
export type OmrsOfflineCachingStrategy =
  | "network-only-or-cache-only"
  | "network-first";

/**
 * Defines the keys of the custom headers which can be appended to an HTTP request.
 * HTTP requests with these headers are handled in a special way by the SPA's service worker.
 */
export type OmrsOfflineHttpHeaders = {
  /**
   * If the client is offline and the request cannot be read from the cache (i.e. if there is no way
   * to receive any kind of data for this request), the service worker will return a response with
   * the body in this header.
   */
  [omrsOfflineResponseBodyHttpHeaderName]?: string;
  /**
   * If the client is offline and the request cannot be read from the cache (i.e. if there is no way
   * to receive any kind of data for this request), the service worker will return a response with
   * the status code defined in this header.
   */
  [omrsOfflineResponseStatusHttpHeaderName]?: `${number}`;
  /**
   * Instructs the service worker to use a specific caching strategy for this request.
   */
  [omrsOfflineCachingStrategyHttpHeaderName]?: OmrsOfflineCachingStrategy;
};

export type OmrsOfflineHttpHeaderNames = keyof OmrsOfflineHttpHeaders;
