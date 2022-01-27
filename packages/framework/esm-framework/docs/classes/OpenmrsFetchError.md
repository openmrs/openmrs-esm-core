[@openmrs/esm-framework](../API.md) / OpenmrsFetchError

# Class: OpenmrsFetchError

## Hierarchy

- `Error`

  ↳ **`OpenmrsFetchError`**

## Table of contents

### Constructors

- [constructor](OpenmrsFetchError.md#constructor)

### Properties

- [message](OpenmrsFetchError.md#message)
- [name](OpenmrsFetchError.md#name)
- [response](OpenmrsFetchError.md#response)
- [responseBody](OpenmrsFetchError.md#responsebody)
- [stack](OpenmrsFetchError.md#stack)
- [prepareStackTrace](OpenmrsFetchError.md#preparestacktrace)
- [stackTraceLimit](OpenmrsFetchError.md#stacktracelimit)

### Methods

- [captureStackTrace](OpenmrsFetchError.md#capturestacktrace)

## Constructors

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

[packages/framework/esm-api/src/openmrs-fetch.ts:270](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L270)

## Properties

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

### response

• **response**: `Response`

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:283](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L283)

___

### responseBody

• **responseBody**: ``null`` \| `string` \| `FetchResponseJson`

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:284](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L284)

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
