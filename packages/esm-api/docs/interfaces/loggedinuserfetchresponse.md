[@openmrs/esm-api](../API.md) / LoggedInUserFetchResponse

# Interface: LoggedInUserFetchResponse

## Hierarchy

* [*FetchResponse*](fetchresponse.md)

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

• `Readonly` **body**: *null* \| *ReadableStream*<Uint8Array\>

Inherited from: [FetchResponse](fetchresponse.md).[body](fetchresponse.md#body)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2552

___

### bodyUsed

• `Readonly` **bodyUsed**: *boolean*

Inherited from: [FetchResponse](fetchresponse.md).[bodyUsed](fetchresponse.md#bodyused)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2553

___

### data

• **data**: [*UnauthenticatedUser*](unauthenticateduser.md) & { `user?`: *undefined* \| [*LoggedInUser*](loggedinuser.md)  }

Overrides: [FetchResponse](fetchresponse.md).[data](fetchresponse.md#data)

Defined in: [packages/esm-api/src/types/index.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/types/index.ts#L57)

___

### headers

• `Readonly` **headers**: Headers

Inherited from: [FetchResponse](fetchresponse.md).[headers](fetchresponse.md#headers)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12623

___

### ok

• `Readonly` **ok**: *boolean*

Inherited from: [FetchResponse](fetchresponse.md).[ok](fetchresponse.md#ok)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12624

___

### redirected

• `Readonly` **redirected**: *boolean*

Inherited from: [FetchResponse](fetchresponse.md).[redirected](fetchresponse.md#redirected)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12625

___

### status

• `Readonly` **status**: *number*

Inherited from: [FetchResponse](fetchresponse.md).[status](fetchresponse.md#status)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12626

___

### statusText

• `Readonly` **statusText**: *string*

Inherited from: [FetchResponse](fetchresponse.md).[statusText](fetchresponse.md#statustext)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12627

___

### trailer

• `Readonly` **trailer**: *Promise*<Headers\>

Inherited from: [FetchResponse](fetchresponse.md).[trailer](fetchresponse.md#trailer)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12628

___

### type

• `Readonly` **type**: ResponseType

Inherited from: [FetchResponse](fetchresponse.md).[type](fetchresponse.md#type)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12629

___

### url

• `Readonly` **url**: *string*

Inherited from: [FetchResponse](fetchresponse.md).[url](fetchresponse.md#url)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12630

## Methods

### arrayBuffer

▸ **arrayBuffer**(): *Promise*<ArrayBuffer\>

**Returns:** *Promise*<ArrayBuffer\>

Inherited from: [FetchResponse](fetchresponse.md)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2554

___

### blob

▸ **blob**(): *Promise*<Blob\>

**Returns:** *Promise*<Blob\>

Inherited from: [FetchResponse](fetchresponse.md)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2555

___

### clone

▸ **clone**(): Response

**Returns:** Response

Inherited from: [FetchResponse](fetchresponse.md)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12631

___

### formData

▸ **formData**(): *Promise*<FormData\>

**Returns:** *Promise*<FormData\>

Inherited from: [FetchResponse](fetchresponse.md)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2556

___

### json

▸ **json**(): *Promise*<any\>

**Returns:** *Promise*<any\>

Inherited from: [FetchResponse](fetchresponse.md)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2557

___

### text

▸ **text**(): *Promise*<string\>

**Returns:** *Promise*<string\>

Inherited from: [FetchResponse](fetchresponse.md)

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2558
