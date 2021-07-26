[@openmrs/esm-framework](../API.md) / LoggedInUserFetchResponse

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
- [trailer](LoggedInUserFetchResponse.md#trailer)
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

node_modules/typescript/lib/lib.dom.d.ts:2583

___

### bodyUsed

• `Readonly` **bodyUsed**: `boolean`

#### Inherited from

[FetchResponse](FetchResponse.md).[bodyUsed](FetchResponse.md#bodyused)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2584

___

### data

• **data**: [`UnauthenticatedUser`](UnauthenticatedUser.md) & { `user?`: [`LoggedInUser`](LoggedInUser.md)  }

#### Overrides

[FetchResponse](FetchResponse.md).[data](FetchResponse.md#data)

#### Defined in

[packages/framework/esm-api/src/types/fetch.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/fetch.ts#L8)

___

### headers

• `Readonly` **headers**: `Headers`

#### Inherited from

[FetchResponse](FetchResponse.md).[headers](FetchResponse.md#headers)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12550

___

### ok

• `Readonly` **ok**: `boolean`

#### Inherited from

[FetchResponse](FetchResponse.md).[ok](FetchResponse.md#ok)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12551

___

### redirected

• `Readonly` **redirected**: `boolean`

#### Inherited from

[FetchResponse](FetchResponse.md).[redirected](FetchResponse.md#redirected)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12552

___

### status

• `Readonly` **status**: `number`

#### Inherited from

[FetchResponse](FetchResponse.md).[status](FetchResponse.md#status)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12553

___

### statusText

• `Readonly` **statusText**: `string`

#### Inherited from

[FetchResponse](FetchResponse.md).[statusText](FetchResponse.md#statustext)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12554

___

### trailer

• `Readonly` **trailer**: `Promise`<`Headers`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[trailer](FetchResponse.md#trailer)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12555

___

### type

• `Readonly` **type**: `ResponseType`

#### Inherited from

[FetchResponse](FetchResponse.md).[type](FetchResponse.md#type)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12556

___

### url

• `Readonly` **url**: `string`

#### Inherited from

[FetchResponse](FetchResponse.md).[url](FetchResponse.md#url)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12557

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<`ArrayBuffer`\>

#### Returns

`Promise`<`ArrayBuffer`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[arrayBuffer](FetchResponse.md#arraybuffer)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2585

___

### blob

▸ **blob**(): `Promise`<`Blob`\>

#### Returns

`Promise`<`Blob`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[blob](FetchResponse.md#blob)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2586

___

### clone

▸ **clone**(): `Response`

#### Returns

`Response`

#### Inherited from

[FetchResponse](FetchResponse.md).[clone](FetchResponse.md#clone)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12558

___

### formData

▸ **formData**(): `Promise`<`FormData`\>

#### Returns

`Promise`<`FormData`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[formData](FetchResponse.md#formdata)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2587

___

### json

▸ **json**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[json](FetchResponse.md#json)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2588

___

### text

▸ **text**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Inherited from

[FetchResponse](FetchResponse.md).[text](FetchResponse.md#text)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2589
