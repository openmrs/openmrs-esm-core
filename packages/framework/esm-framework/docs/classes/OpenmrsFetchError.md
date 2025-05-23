[@openmrs/esm-framework](../API.md) / OpenmrsFetchError

# Class: OpenmrsFetchError

## Hierarchy

- `Error`

  ↳ **`OpenmrsFetchError`**

## Implements

- [`FetchError`](../interfaces/FetchError.md)

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
- [prepareStackTrace](OpenmrsFetchError.md#preparestacktrace)
- [stackTraceLimit](OpenmrsFetchError.md#stacktracelimit)

### Methods

- [captureStackTrace](OpenmrsFetchError.md#capturestacktrace)

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

[packages/framework/esm-api/src/openmrs-fetch.ts:302](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L302)

## API Properties

### response

• **response**: `Response`

#### Implementation of

[FetchError](../interfaces/FetchError.md).[response](../interfaces/FetchError.md#response)

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:310](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L310)

___

### responseBody

• **responseBody**: ``null`` \| `string` \| [`FetchResponseJson`](../interfaces/FetchResponseJson.md)

#### Implementation of

[FetchError](../interfaces/FetchError.md).[responseBody](../interfaces/FetchError.md#responsebody)

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:311](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L311)

___

## Other Properties

### cause

• `Optional` **cause**: `unknown`

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

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
