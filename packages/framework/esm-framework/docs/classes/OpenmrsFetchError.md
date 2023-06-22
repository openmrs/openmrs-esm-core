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

[packages/framework/esm-api/src/openmrs-fetch.ts:321](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L321)

## API Properties

### response

• **response**: `Response`

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:334](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L334)

___

### responseBody

• **responseBody**: ``null`` \| `string` \| [`FetchResponseJson`](../interfaces/FetchResponseJson.md)

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:335](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L335)

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

packages/framework/esm-framework/node_modules/@types/node/ts4.8/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

packages/framework/esm-framework/node_modules/@types/node/ts4.8/globals.d.ts:13

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

packages/framework/esm-framework/node_modules/@types/node/ts4.8/globals.d.ts:4
