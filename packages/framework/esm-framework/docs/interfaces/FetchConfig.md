[O3 Framework](../API.md) / FetchConfig

# Interface: FetchConfig

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:317](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L317)

## Extends

- `Omit`\<`RequestInit`, `"body"` \| `"headers"`\>

## Properties

### body?

> `optional` **body**: `string` \| `FetchBody`

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:319](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L319)

***

### cache?

> `optional` **cache**: `RequestCache`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1924

A string indicating how the request will interact with the browser's cache to set request's cache.

#### Inherited from

`Omit.cache`

***

### credentials?

> `optional` **credentials**: `RequestCredentials`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1926

A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.

#### Inherited from

`Omit.credentials`

***

### headers?

> `optional` **headers**: [`FetchHeaders`](FetchHeaders.md)

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:318](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L318)

***

### integrity?

> `optional` **integrity**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1930

A cryptographic hash of the resource to be fetched by request. Sets request's integrity.

#### Inherited from

`Omit.integrity`

***

### keepalive?

> `optional` **keepalive**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1932

A boolean to set request's keepalive.

#### Inherited from

`Omit.keepalive`

***

### method?

> `optional` **method**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1934

A string to set request's method.

#### Inherited from

`Omit.method`

***

### mode?

> `optional` **mode**: `RequestMode`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1936

A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.

#### Inherited from

`Omit.mode`

***

### priority?

> `optional` **priority**: `RequestPriority`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1937

#### Inherited from

`Omit.priority`

***

### redirect?

> `optional` **redirect**: `RequestRedirect`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1939

A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.

#### Inherited from

`Omit.redirect`

***

### referrer?

> `optional` **referrer**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1941

A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.

#### Inherited from

`Omit.referrer`

***

### referrerPolicy?

> `optional` **referrerPolicy**: `ReferrerPolicy`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1943

A referrer policy to set request's referrerPolicy.

#### Inherited from

`Omit.referrerPolicy`

***

### signal?

> `optional` **signal**: `null` \| `AbortSignal`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1945

An AbortSignal to set request's signal.

#### Inherited from

`Omit.signal`

***

### window?

> `optional` **window**: `null`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:1947

Can only be null. Used to disassociate request from any Window.

#### Inherited from

`Omit.window`
