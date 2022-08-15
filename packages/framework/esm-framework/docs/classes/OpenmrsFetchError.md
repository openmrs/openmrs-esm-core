[@openmrs/esm-framework](../API.md) / OpenmrsFetchError

# Class: OpenmrsFetchError

## Hierarchy

- `Error`

  ↳ **`OpenmrsFetchError`**

## Table of contents

### API Constructors

- [constructor](OpenmrsFetchError.md#constructor)

### API Properties

- [response](OpenmrsFetchError.md#response)
- [responseBody](OpenmrsFetchError.md#responsebody)

### Other Properties

- [cause](OpenmrsFetchError.md#cause)
- [message](OpenmrsFetchError.md#message)
- [name](OpenmrsFetchError.md#name)
- [stack](OpenmrsFetchError.md#stack)
- [stackTraceLimit](OpenmrsFetchError.md#stacktracelimit)

### Methods

- [captureStackTrace](OpenmrsFetchError.md#capturestacktrace)
- [prepareStackTrace](OpenmrsFetchError.md#preparestacktrace)

## API Constructors

### constructor

• **new OpenmrsFetchError**(`url`, `response`, `responseBody`, `requestStacktrace`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `response` | `Response` |
| `responseBody` | ``null`` \| `ResponseBody` |
| `requestStacktrace` | `Error` |

#### Overrides

Error.constructor

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:281](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L281)

## API Properties

### response

• **response**: `Response`

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:294](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L294)

___

### responseBody

• **responseBody**: ``null`` \| `string` \| [`FetchResponseJson`](../interfaces/FetchResponseJson.md)

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:295](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L295)

___

## Other Properties

### cause

• `Optional` **cause**: `Error`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:142

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `Object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:133

___

### prepareStackTrace

▸ `Static` `Optional` **prepareStackTrace**(`err`, `stackTraces`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:140
