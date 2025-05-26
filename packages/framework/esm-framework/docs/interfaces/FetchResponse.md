[@openmrs/esm-framework](../API.md) / FetchResponse

# Interface: FetchResponse<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- `Response`

  ↳ **`FetchResponse`**

  ↳↳ [`LoggedInUserFetchResponse`](LoggedInUserFetchResponse.md)

## Table of contents

### Properties

- [body](FetchResponse.md#body)
- [bodyUsed](FetchResponse.md#bodyused)
- [data](FetchResponse.md#data)
- [headers](FetchResponse.md#headers)
- [ok](FetchResponse.md#ok)
- [redirected](FetchResponse.md#redirected)
- [status](FetchResponse.md#status)
- [statusText](FetchResponse.md#statustext)
- [type](FetchResponse.md#type)
- [url](FetchResponse.md#url)

### Methods

- [arrayBuffer](FetchResponse.md#arraybuffer)
- [blob](FetchResponse.md#blob)
- [clone](FetchResponse.md#clone)
- [formData](FetchResponse.md#formdata)
- [json](FetchResponse.md#json)
- [text](FetchResponse.md#text)

## Properties

### body

• `Readonly` **body**: ``null`` \| `ReadableStream`<`Uint8Array`\>

#### Inherited from

Response.body

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2587

___

### bodyUsed

• `Readonly` **bodyUsed**: `boolean`

#### Inherited from

Response.bodyUsed

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2588

___

### data

• **data**: `T`

#### Defined in

[packages/framework/esm-api/src/types/fetch.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/fetch.ts#L4)

___

### headers

• `Readonly` **headers**: `Headers`

#### Inherited from

Response.headers

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:11772

___

### ok

• `Readonly` **ok**: `boolean`

#### Inherited from

Response.ok

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:11773

___

### redirected

• `Readonly` **redirected**: `boolean`

#### Inherited from

Response.redirected

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:11774

___

### status

• `Readonly` **status**: `number`

#### Inherited from

Response.status

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:11775

___

### statusText

• `Readonly` **statusText**: `string`

#### Inherited from

Response.statusText

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:11776

___

### type

• `Readonly` **type**: `ResponseType`

#### Inherited from

Response.type

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:11777

___

### url

• `Readonly` **url**: `string`

#### Inherited from

Response.url

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:11778

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<`ArrayBuffer`\>

#### Returns

`Promise`<`ArrayBuffer`\>

#### Inherited from

Response.arrayBuffer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2589

___

### blob

▸ **blob**(): `Promise`<`Blob`\>

#### Returns

`Promise`<`Blob`\>

#### Inherited from

Response.blob

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2590

___

### clone

▸ **clone**(): `Response`

#### Returns

`Response`

#### Inherited from

Response.clone

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:11779

___

### formData

▸ **formData**(): `Promise`<`FormData`\>

#### Returns

`Promise`<`FormData`\>

#### Inherited from

Response.formData

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2591

___

### json

▸ **json**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

Response.json

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2592

___

### text

▸ **text**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Inherited from

Response.text

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2593
