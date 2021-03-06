[@openmrs/esm-api](../API.md) / OpenmrsFetchError

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

\+ **new OpenmrsFetchError**(`url`: *string*, `response`: Response, `responseBody`: *null* \| *string* \| FetchResponseJson, `requestStacktrace`: Error): [*OpenmrsFetchError*](openmrsfetcherror.md)

#### Parameters:

Name | Type |
:------ | :------ |
`url` | *string* |
`response` | Response |
`responseBody` | *null* \| *string* \| FetchResponseJson |
`requestStacktrace` | Error |

**Returns:** [*OpenmrsFetchError*](openmrsfetcherror.md)

Defined in: [packages/esm-api/src/openmrs-fetch.ts:263](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L263)

## Properties

### message

• **message**: *string*

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: *string*

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

___

### response

• **response**: Response

Defined in: [packages/esm-api/src/openmrs-fetch.ts:277](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L277)

___

### responseBody

• **responseBody**: *null* \| *string* \| FetchResponseJson

Defined in: [packages/esm-api/src/openmrs-fetch.ts:278](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L278)

___

### stack

• `Optional` **stack**: *undefined* \| *string*

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### prepareStackTrace

▪ `Optional` `Static` **prepareStackTrace**: *undefined* \| (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Defined in: node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static`**captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
:------ | :------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Defined in: node_modules/@types/node/globals.d.ts:4
