[@openmrs/esm-framework](../API.md) / FetchResponse

# Interface: FetchResponse<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` = `any` |

## Hierarchy

- `Response`

  ↳ **FetchResponse**

  ↳↳ [LoggedInUserFetchResponse](loggedinuserfetchresponse.md)

## Table of contents

### Properties

- [body](fetchresponse.md#body)
- [bodyUsed](fetchresponse.md#bodyused)
- [data](fetchresponse.md#data)
- [headers](fetchresponse.md#headers)
- [ok](fetchresponse.md#ok)
- [redirected](fetchresponse.md#redirected)
- [status](fetchresponse.md#status)
- [statusText](fetchresponse.md#statustext)
- [trailer](fetchresponse.md#trailer)
- [type](fetchresponse.md#type)
- [url](fetchresponse.md#url)

### Methods

- [arrayBuffer](fetchresponse.md#arraybuffer)
- [blob](fetchresponse.md#blob)
- [clone](fetchresponse.md#clone)
- [formData](fetchresponse.md#formdata)
- [json](fetchresponse.md#json)
- [text](fetchresponse.md#text)

## Properties

### body

• `Readonly` **body**: ``null`` \| `ReadableStream`<Uint8Array\>

#### Inherited from

Response.body

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2583

___

### bodyUsed

• `Readonly` **bodyUsed**: `boolean`

#### Inherited from

Response.bodyUsed

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2584

___

### data

• **data**: `T`

#### Defined in

[packages/framework/esm-api/src/types/fetch.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/fetch.ts#L4)

___

### headers

• `Readonly` **headers**: `Headers`

#### Inherited from

Response.headers

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12550

___

### ok

• `Readonly` **ok**: `boolean`

#### Inherited from

Response.ok

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12551

___

### redirected

• `Readonly` **redirected**: `boolean`

#### Inherited from

Response.redirected

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12552

___

### status

• `Readonly` **status**: `number`

#### Inherited from

Response.status

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12553

___

### statusText

• `Readonly` **statusText**: `string`

#### Inherited from

Response.statusText

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12554

___

### trailer

• `Readonly` **trailer**: `Promise`<Headers\>

#### Inherited from

Response.trailer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12555

___

### type

• `Readonly` **type**: `ResponseType`

#### Inherited from

Response.type

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12556

___

### url

• `Readonly` **url**: `string`

#### Inherited from

Response.url

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12557

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<ArrayBuffer\>

#### Returns

`Promise`<ArrayBuffer\>

#### Inherited from

Response.arrayBuffer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2585

___

### blob

▸ **blob**(): `Promise`<Blob\>

#### Returns

`Promise`<Blob\>

#### Inherited from

Response.blob

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2586

___

### clone

▸ **clone**(): `Response`

#### Returns

`Response`

#### Inherited from

Response.clone

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12558

___

### formData

▸ **formData**(): `Promise`<FormData\>

#### Returns

`Promise`<FormData\>

#### Inherited from

Response.formData

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2587

___

### json

▸ **json**(): `Promise`<any\>

#### Returns

`Promise`<any\>

#### Inherited from

Response.json

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2588

___

### text

▸ **text**(): `Promise`<string\>

#### Returns

`Promise`<string\>

#### Inherited from

Response.text

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2589
