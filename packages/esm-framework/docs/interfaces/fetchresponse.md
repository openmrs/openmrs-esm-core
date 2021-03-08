[@openmrs/esm-framework](../API.md) / FetchResponse

# Interface: FetchResponse<T\>

## Type parameters

Name | Default |
:------ | :------ |
`T` | *any* |

## Hierarchy

* *Response*

  ↳ **FetchResponse**

  ↳↳ [*LoggedInUserFetchResponse*](loggedinuserfetchresponse.md)

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

• `Readonly` **body**: *null* \| *ReadableStream*<Uint8Array\>

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2552

___

### bodyUsed

• `Readonly` **bodyUsed**: *boolean*

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2553

___

### data

• **data**: T

Defined in: [packages/esm-api/src/types/index.ts:2](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/types/index.ts#L2)

___

### headers

• `Readonly` **headers**: Headers

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12623

___

### ok

• `Readonly` **ok**: *boolean*

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12624

___

### redirected

• `Readonly` **redirected**: *boolean*

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12625

___

### status

• `Readonly` **status**: *number*

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12626

___

### statusText

• `Readonly` **statusText**: *string*

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12627

___

### trailer

• `Readonly` **trailer**: *Promise*<Headers\>

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12628

___

### type

• `Readonly` **type**: ResponseType

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12629

___

### url

• `Readonly` **url**: *string*

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12630

## Methods

### arrayBuffer

▸ **arrayBuffer**(): *Promise*<ArrayBuffer\>

**Returns:** *Promise*<ArrayBuffer\>

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2554

___

### blob

▸ **blob**(): *Promise*<Blob\>

**Returns:** *Promise*<Blob\>

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2555

___

### clone

▸ **clone**(): Response

**Returns:** Response

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12631

___

### formData

▸ **formData**(): *Promise*<FormData\>

**Returns:** *Promise*<FormData\>

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2556

___

### json

▸ **json**(): *Promise*<any\>

**Returns:** *Promise*<any\>

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2557

___

### text

▸ **text**(): *Promise*<string\>

**Returns:** *Promise*<string\>

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2558
