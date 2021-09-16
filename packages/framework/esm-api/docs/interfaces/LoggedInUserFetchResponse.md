[@openmrs/esm-api](../API.md) / LoggedInUserFetchResponse

# Interface: LoggedInUserFetchResponse

## Hierarchy

- [`FetchResponse`](FetchResponse.md)

  ↳ **`LoggedInUserFetchResponse`**

## Table of contents

### Properties

- [body](LoggedInUserFetchResponse.md#body)
- [bodyUsed](LoggedInUserFetchResponse.md#bodyused)
- [data](LoggedInUserFetchResponse.md#data)
- [headers](LoggedInUserFetchResponse.md#headers)
- [ok](LoggedInUserFetchResponse.md#ok)
- [redirected](LoggedInUserFetchResponse.md#redirected)
- [status](LoggedInUserFetchResponse.md#status)
- [statusText](LoggedInUserFetchResponse.md#statustext)
- [type](LoggedInUserFetchResponse.md#type)
- [url](LoggedInUserFetchResponse.md#url)

### Methods

- [arrayBuffer](LoggedInUserFetchResponse.md#arraybuffer)
- [blob](LoggedInUserFetchResponse.md#blob)
- [clone](LoggedInUserFetchResponse.md#clone)
- [formData](LoggedInUserFetchResponse.md#formdata)
- [json](LoggedInUserFetchResponse.md#json)
- [text](LoggedInUserFetchResponse.md#text)

## Properties

### body

• `Readonly` **body**: ``null`` \| `ReadableStream`<`Uint8Array`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[body](FetchResponse.md#body)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2444

___

### bodyUsed

• `Readonly` **bodyUsed**: `boolean`

#### Inherited from

[FetchResponse](FetchResponse.md).[bodyUsed](FetchResponse.md#bodyused)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2445

___

### data

• **data**: [`LoggedInUserData`](../API.md#loggedinuserdata)

#### Overrides

[FetchResponse](FetchResponse.md).[data](FetchResponse.md#data)

#### Defined in

[packages/framework/esm-api/src/types/fetch.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/fetch.ts#L12)

___

### headers

• `Readonly` **headers**: `Headers`

#### Inherited from

[FetchResponse](FetchResponse.md).[headers](FetchResponse.md#headers)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12143

___

### ok

• `Readonly` **ok**: `boolean`

#### Inherited from

[FetchResponse](FetchResponse.md).[ok](FetchResponse.md#ok)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12144

___

### redirected

• `Readonly` **redirected**: `boolean`

#### Inherited from

[FetchResponse](FetchResponse.md).[redirected](FetchResponse.md#redirected)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12145

___

### status

• `Readonly` **status**: `number`

#### Inherited from

[FetchResponse](FetchResponse.md).[status](FetchResponse.md#status)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12146

___

### statusText

• `Readonly` **statusText**: `string`

#### Inherited from

[FetchResponse](FetchResponse.md).[statusText](FetchResponse.md#statustext)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12147

___

### type

• `Readonly` **type**: `ResponseType`

#### Inherited from

[FetchResponse](FetchResponse.md).[type](FetchResponse.md#type)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12148

___

### url

• `Readonly` **url**: `string`

#### Inherited from

[FetchResponse](FetchResponse.md).[url](FetchResponse.md#url)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12149

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<`ArrayBuffer`\>

#### Returns

`Promise`<`ArrayBuffer`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[arrayBuffer](FetchResponse.md#arraybuffer)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2446

___

### blob

▸ **blob**(): `Promise`<`Blob`\>

#### Returns

`Promise`<`Blob`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[blob](FetchResponse.md#blob)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2447

___

### clone

▸ **clone**(): `Response`

#### Returns

`Response`

#### Inherited from

[FetchResponse](FetchResponse.md).[clone](FetchResponse.md#clone)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12150

___

### formData

▸ **formData**(): `Promise`<`FormData`\>

#### Returns

`Promise`<`FormData`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[formData](FetchResponse.md#formdata)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2448

___

### json

▸ **json**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[json](FetchResponse.md#json)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2449

___

### text

▸ **text**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[text](FetchResponse.md#text)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2450
