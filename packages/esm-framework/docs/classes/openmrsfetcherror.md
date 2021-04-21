[@openmrs/esm-framework](../API.md) / OpenmrsFetchError

# Class: OpenmrsFetchError

## Hierarchy

* *Error*

  ↳ **OpenmrsFetchError**

## Table of contents

### Constructors

- [constructor](openmrsfetcherror.md#constructor)

### Properties

- [message](openmrsfetcherror.md#message)
- [name](openmrsfetcherror.md#name)
- [response](openmrsfetcherror.md#response)
- [responseBody](openmrsfetcherror.md#responsebody)
- [stack](openmrsfetcherror.md#stack)
- [prepareStackTrace](openmrsfetcherror.md#preparestacktrace)
- [stackTraceLimit](openmrsfetcherror.md#stacktracelimit)

### Methods

- [captureStackTrace](openmrsfetcherror.md#capturestacktrace)

## Constructors

### constructor

\+ **new OpenmrsFetchError**(`url`: *string*, `response`: Response, `responseBody`: ``null`` \| ResponseBody, `requestStacktrace`: Error): [*OpenmrsFetchError*](openmrsfetcherror.md)

#### Parameters:

| Name | Type |
| :------ | :------ |
| `url` | *string* |
| `response` | Response |
| `responseBody` | ``null`` \| ResponseBody |
| `requestStacktrace` | Error |

**Returns:** [*OpenmrsFetchError*](openmrsfetcherror.md)

Overrides: Error.constructor

Defined in: [packages/esm-api/src/openmrs-fetch.ts:269](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L269)

## Properties

### message

• **message**: *string*

Inherited from: Error.message

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: *string*

Inherited from: Error.name

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

___

### response

• **response**: Response

Defined in: [packages/esm-api/src/openmrs-fetch.ts:283](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L283)

___

### responseBody

• **responseBody**: ``null`` \| *string* \| FetchResponseJson

Defined in: [packages/esm-api/src/openmrs-fetch.ts:284](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L284)

___

### stack

• `Optional` **stack**: *string*

Inherited from: Error.stack

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration:

▸ (`err`: Error, `stackTraces`: CallSite[]): *any*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `err` | Error |
| `stackTraces` | CallSite[] |

**Returns:** *any*

Defined in: node_modules/@types/node/globals.d.ts:11

Inherited from: Error.prepareStackTrace

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Inherited from: Error.stackTraceLimit

Defined in: node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static`**captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

| Name | Type |
| :------ | :------ |
| `targetObject` | *object* |
| `constructorOpt?` | Function |

**Returns:** *void*

Inherited from: Error.captureStackTrace

Defined in: node_modules/@types/node/globals.d.ts:4
