[O3 Framework](../API.md) / LoggedInUserFetchResponse

# Interface: LoggedInUserFetchResponse

Defined in: [packages/framework/esm-api/src/types/fetch.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/fetch.ts#L7)

## Extends

- [`FetchResponse`](FetchResponse.md)

## Properties

### body

> `readonly` **body**: `null` \| `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3534

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/body)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`body`](FetchResponse.md#body)

***

### bodyUsed

> `readonly` **bodyUsed**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3536

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/bodyUsed)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`bodyUsed`](FetchResponse.md#bodyused)

***

### data

> **data**: [`Session`](Session.md)

Defined in: [packages/framework/esm-api/src/types/fetch.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/fetch.ts#L8)

#### Overrides

[`FetchResponse`](FetchResponse.md).[`data`](FetchResponse.md#data)

***

### headers

> `readonly` **headers**: `Headers`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19881

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/headers)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`headers`](FetchResponse.md#headers)

***

### ok

> `readonly` **ok**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19883

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/ok)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`ok`](FetchResponse.md#ok)

***

### redirected

> `readonly` **redirected**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19885

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/redirected)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`redirected`](FetchResponse.md#redirected)

***

### status

> `readonly` **status**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19887

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/status)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`status`](FetchResponse.md#status)

***

### statusText

> `readonly` **statusText**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19889

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/statusText)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`statusText`](FetchResponse.md#statustext)

***

### type

> `readonly` **type**: `ResponseType`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19891

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/type)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`type`](FetchResponse.md#type)

***

### url

> `readonly` **url**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19893

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/url)

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`url`](FetchResponse.md#url)

## Methods

### arrayBuffer()

> **arrayBuffer**(): `Promise`\<`ArrayBuffer`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3538

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/arrayBuffer)

#### Returns

`Promise`\<`ArrayBuffer`\>

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`arrayBuffer`](FetchResponse.md#arraybuffer)

***

### blob()

> **blob**(): `Promise`\<`Blob`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3540

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/blob)

#### Returns

`Promise`\<`Blob`\>

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`blob`](FetchResponse.md#blob)

***

### bytes()

> **bytes**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3542

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/bytes)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`bytes`](FetchResponse.md#bytes)

***

### clone()

> **clone**(): `Response`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:19895

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/clone)

#### Returns

`Response`

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`clone`](FetchResponse.md#clone)

***

### formData()

> **formData**(): `Promise`\<`FormData`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3544

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData)

#### Returns

`Promise`\<`FormData`\>

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`formData`](FetchResponse.md#formdata)

***

### json()

> **json**(): `Promise`\<`any`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3546

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json)

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`json`](FetchResponse.md#json)

***

### text()

> **text**(): `Promise`\<`string`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3548

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text)

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`FetchResponse`](FetchResponse.md).[`text`](FetchResponse.md#text)
