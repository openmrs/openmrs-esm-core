[@openmrs/esm-api](../API.md) / [Exports](../modules.md) / LoggedInUserFetchResponse

# Interface: LoggedInUserFetchResponse

## Hierarchy

- [FetchResponse](fetchresponse.md)

  ↳ **LoggedInUserFetchResponse**

## Table of contents

### Properties

- [body](loggedinuserfetchresponse.md#body)
- [bodyUsed](loggedinuserfetchresponse.md#bodyused)
- [data](loggedinuserfetchresponse.md#data)
- [headers](loggedinuserfetchresponse.md#headers)
- [ok](loggedinuserfetchresponse.md#ok)
- [redirected](loggedinuserfetchresponse.md#redirected)
- [status](loggedinuserfetchresponse.md#status)
- [statusText](loggedinuserfetchresponse.md#statustext)
- [trailer](loggedinuserfetchresponse.md#trailer)
- [type](loggedinuserfetchresponse.md#type)
- [url](loggedinuserfetchresponse.md#url)

### Methods

- [arrayBuffer](loggedinuserfetchresponse.md#arraybuffer)
- [blob](loggedinuserfetchresponse.md#blob)
- [clone](loggedinuserfetchresponse.md#clone)
- [formData](loggedinuserfetchresponse.md#formdata)
- [json](loggedinuserfetchresponse.md#json)
- [text](loggedinuserfetchresponse.md#text)

## Properties

### body

• `Readonly` **body**: ``null`` \| `ReadableStream`<Uint8Array\>

#### Inherited from

[FetchResponse](fetchresponse.md).[body](fetchresponse.md#body)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2583

___

### bodyUsed

• `Readonly` **bodyUsed**: `boolean`

#### Inherited from

[FetchResponse](fetchresponse.md).[bodyUsed](fetchresponse.md#bodyused)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2584

___

### data

• **data**: [UnauthenticatedUser](unauthenticateduser.md) & { `user?`: [LoggedInUser](loggedinuser.md)  }

#### Overrides

[FetchResponse](fetchresponse.md).[data](fetchresponse.md#data)

#### Defined in

[packages/framework/esm-api/src/types/fetch.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/fetch.ts#L8)

___

### headers

• `Readonly` **headers**: `Headers`

#### Inherited from

[FetchResponse](fetchresponse.md).[headers](fetchresponse.md#headers)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12550

___

### ok

• `Readonly` **ok**: `boolean`

#### Inherited from

[FetchResponse](fetchresponse.md).[ok](fetchresponse.md#ok)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12551

___

### redirected

• `Readonly` **redirected**: `boolean`

#### Inherited from

[FetchResponse](fetchresponse.md).[redirected](fetchresponse.md#redirected)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12552

___

### status

• `Readonly` **status**: `number`

#### Inherited from

[FetchResponse](fetchresponse.md).[status](fetchresponse.md#status)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12553

___

### statusText

• `Readonly` **statusText**: `string`

#### Inherited from

[FetchResponse](fetchresponse.md).[statusText](fetchresponse.md#statustext)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12554

___

### trailer

• `Readonly` **trailer**: `Promise`<Headers\>

#### Inherited from

[FetchResponse](fetchresponse.md).[trailer](fetchresponse.md#trailer)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12555

___

### type

• `Readonly` **type**: `ResponseType`

#### Inherited from

[FetchResponse](fetchresponse.md).[type](fetchresponse.md#type)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12556

___

### url

• `Readonly` **url**: `string`

#### Inherited from

[FetchResponse](fetchresponse.md).[url](fetchresponse.md#url)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12557

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<ArrayBuffer\>

#### Returns

`Promise`<ArrayBuffer\>

#### Inherited from

[FetchResponse](fetchresponse.md).[arrayBuffer](fetchresponse.md#arraybuffer)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2585

___

### blob

▸ **blob**(): `Promise`<Blob\>

#### Returns

`Promise`<Blob\>

#### Inherited from

[FetchResponse](fetchresponse.md).[blob](fetchresponse.md#blob)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2586

___

### clone

▸ **clone**(): `Response`

#### Returns

`Response`

#### Inherited from

[FetchResponse](fetchresponse.md).[clone](fetchresponse.md#clone)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:12558

___

### formData

▸ **formData**(): `Promise`<FormData\>

#### Returns

`Promise`<FormData\>

#### Inherited from

[FetchResponse](fetchresponse.md).[formData](fetchresponse.md#formdata)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2587

___

### json

▸ **json**(): `Promise`<any\>

#### Returns

`Promise`<any\>

#### Inherited from

[FetchResponse](fetchresponse.md).[json](fetchresponse.md#json)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2588

___

### text

▸ **text**(): `Promise`<string\>

#### Returns

`Promise`<string\>

#### Inherited from

[FetchResponse](fetchresponse.md).[text](fetchresponse.md#text)

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2589
