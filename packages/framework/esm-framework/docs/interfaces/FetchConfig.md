[@openmrs/esm-framework](../API.md) / FetchConfig

# Interface: FetchConfig

## Hierarchy

- `Omit`<`RequestInit`, ``"body"`` \| ``"headers"``\>

  ↳ **`FetchConfig`**

## Table of contents

### API Properties

- [body](FetchConfig.md#body)
- [headers](FetchConfig.md#headers)

### Other Properties

- [cache](FetchConfig.md#cache)
- [credentials](FetchConfig.md#credentials)
- [integrity](FetchConfig.md#integrity)
- [keepalive](FetchConfig.md#keepalive)
- [method](FetchConfig.md#method)
- [mode](FetchConfig.md#mode)
- [redirect](FetchConfig.md#redirect)
- [referrer](FetchConfig.md#referrer)
- [referrerPolicy](FetchConfig.md#referrerpolicy)
- [signal](FetchConfig.md#signal)
- [window](FetchConfig.md#window)

## API Properties

### body

• `Optional` **body**: `string` \| `FetchBody`

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:340](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L340)

___

### headers

• `Optional` **headers**: [`FetchHeaders`](FetchHeaders.md)

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:339](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L339)

___

## Other Properties

### cache

• `Optional` **cache**: `RequestCache`

A string indicating how the request will interact with the browser's cache to set request's cache.

#### Inherited from

Omit.cache

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1500

___

### credentials

• `Optional` **credentials**: `RequestCredentials`

A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.

#### Inherited from

Omit.credentials

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1502

___

### integrity

• `Optional` **integrity**: `string`

A cryptographic hash of the resource to be fetched by request. Sets request's integrity.

#### Inherited from

Omit.integrity

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1506

___

### keepalive

• `Optional` **keepalive**: `boolean`

A boolean to set request's keepalive.

#### Inherited from

Omit.keepalive

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1508

___

### method

• `Optional` **method**: `string`

A string to set request's method.

#### Inherited from

Omit.method

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1510

___

### mode

• `Optional` **mode**: `RequestMode`

A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.

#### Inherited from

Omit.mode

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1512

___

### redirect

• `Optional` **redirect**: `RequestRedirect`

A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.

#### Inherited from

Omit.redirect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1514

___

### referrer

• `Optional` **referrer**: `string`

A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.

#### Inherited from

Omit.referrer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1516

___

### referrerPolicy

• `Optional` **referrerPolicy**: `ReferrerPolicy`

A referrer policy to set request's referrerPolicy.

#### Inherited from

Omit.referrerPolicy

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1518

___

### signal

• `Optional` **signal**: ``null`` \| `AbortSignal`

An AbortSignal to set request's signal.

#### Inherited from

Omit.signal

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1520

___

### window

• `Optional` **window**: ``null``

Can only be null. Used to disassociate request from any Window.

#### Inherited from

Omit.window

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1522
