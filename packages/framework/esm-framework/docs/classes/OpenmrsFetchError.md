[O3 Framework](../API.md) / OpenmrsFetchError

# Class: OpenmrsFetchError

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:304](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L304)

## Extends

- `Error`

## Implements

- [`FetchError`](../interfaces/FetchError.md)

## Constructors

### Constructor

> **new OpenmrsFetchError**(`url`, `response`, `responseBody`, `requestStacktrace`): `OpenmrsFetchError`

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:305](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L305)

#### Parameters

##### url

`string`

##### response

`Response`

##### responseBody

`null` | `ResponseBody`

##### requestStacktrace

`Error`

#### Returns

`OpenmrsFetchError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:11

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### response

> **response**: `Response`

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:313](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L313)

#### Implementation of

[`FetchError`](../interfaces/FetchError.md).[`response`](../interfaces/FetchError.md#response)

***

### responseBody

> **responseBody**: `null` \| `string` \| [`FetchResponseJson`](../interfaces/FetchResponseJson.md)

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:314](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L314)

#### Implementation of

[`FetchError`](../interfaces/FetchError.md).[`responseBody`](../interfaces/FetchError.md#responsebody)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:13

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/@types/node/globals.d.ts:4

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
