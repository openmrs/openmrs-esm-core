[O3 Framework](../API.md) / FetchResponse

# Interface: FetchResponse\<T\>

Defined in: [packages/framework/esm-api/src/types/fetch.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/fetch.ts#L3)

## Extends

- `Response`

## Extended by

- [`LoggedInUserFetchResponse`](LoggedInUserFetchResponse.md)

## Type Parameters

### T

`T` = `any`

## Properties

### body

> `readonly` **body**: `null` \| `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3534

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/body)

#### Inherited from

`Response.body`

***

### bodyUsed

> `readonly` **bodyUsed**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3536

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/bodyUsed)

#### Inherited from

`Response.bodyUsed`

***

### data

> **data**: `T`

Defined in: [packages/framework/esm-api/src/types/fetch.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/fetch.ts#L4)

***

### headers

> `readonly` **headers**: `Headers`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19881

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/headers)

#### Inherited from

`Response.headers`

***

### ok

> `readonly` **ok**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19883

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/ok)

#### Inherited from

`Response.ok`

***

### redirected

> `readonly` **redirected**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19885

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/redirected)

#### Inherited from

`Response.redirected`

***

### status

> `readonly` **status**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19887

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/status)

#### Inherited from

`Response.status`

***

### statusText

> `readonly` **statusText**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19889

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/statusText)

#### Inherited from

`Response.statusText`

***

### type

> `readonly` **type**: `ResponseType`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19891

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/type)

#### Inherited from

`Response.type`

***

### url

> `readonly` **url**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19893

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/url)

#### Inherited from

`Response.url`

## Methods

### arrayBuffer()

> **arrayBuffer**(): `Promise`\<`ArrayBuffer`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3538

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/arrayBuffer)

#### Returns

`Promise`\<`ArrayBuffer`\>

#### Inherited from

`Response.arrayBuffer`

***

### blob()

> **blob**(): `Promise`\<`Blob`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3540

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/blob)

#### Returns

`Promise`\<`Blob`\>

#### Inherited from

`Response.blob`

***

### bytes()

> **bytes**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3542

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/bytes)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`Response.bytes`

***

### clone()

> **clone**(): `Response`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19895

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/clone)

#### Returns

`Response`

#### Inherited from

`Response.clone`

***

### formData()

> **formData**(): `Promise`\<`FormData`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3544

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData)

#### Returns

`Promise`\<`FormData`\>

#### Inherited from

`Response.formData`

***

### json()

> **json**(): `Promise`\<`any`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3546

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json)

#### Returns

`Promise`\<`any`\>

#### Inherited from

`Response.json`

***

### text()

> **text**(): `Promise`\<`string`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3548

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text)

#### Returns

`Promise`\<`string`\>

#### Inherited from

`Response.text`
