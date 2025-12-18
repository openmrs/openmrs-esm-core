[O3 Framework](../API.md) / OmrsOfflineHttpHeaders

# Type Alias: OmrsOfflineHttpHeaders

> **OmrsOfflineHttpHeaders** = `object`

Defined in: [packages/framework/esm-offline/src/service-worker-http-headers.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L21)

Defines the keys of the custom headers which can be appended to an HTTP request.
HTTP requests with these headers are handled in a special way by the SPA's service worker.

## Properties

### x-omrs-offline-caching-strategy?

> `optional` **x-omrs-offline-caching-strategy**: [`OmrsOfflineCachingStrategy`](OmrsOfflineCachingStrategy.md)

Defined in: [packages/framework/esm-offline/src/service-worker-http-headers.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L37)

Instructs the service worker to use a specific caching strategy for this request.

***

### x-omrs-offline-response-body?

> `optional` **x-omrs-offline-response-body**: `string`

Defined in: [packages/framework/esm-offline/src/service-worker-http-headers.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L27)

If the client is offline and the request cannot be read from the cache (i.e. if there is no way
to receive any kind of data for this request), the service worker will return a response with
the body in this header.

***

### x-omrs-offline-response-status?

> `optional` **x-omrs-offline-response-status**: `` `${number}` ``

Defined in: [packages/framework/esm-offline/src/service-worker-http-headers.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L33)

If the client is offline and the request cannot be read from the cache (i.e. if there is no way
to receive any kind of data for this request), the service worker will return a response with
the status code defined in this header.
