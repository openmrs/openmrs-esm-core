[O3 Framework](../API.md) / useOpenmrsSWR

# Function: useOpenmrsSWR()

> **useOpenmrsSWR**\<`DataType`, `ErrorType`\>(`key`, `options`): `SWRResponse`\<`FetchResponse`\<`DataType`\>, `ErrorType`, `undefined` \| `SWRConfiguration`\<`FetchResponse`\<`DataType`\>, `ErrorType`, `BareFetcher`\<`FetchResponse`\<`DataType`\>\>\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsSWR.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsSWR.ts#L70)

**`Beta`**

This hook is intended to simplify using openmrsFetch in useSWR, while also ensuring that
all useSWR usages properly use an abort controller, so that fetch requests are cancelled
if the React component unmounts.

## Type Parameters

### DataType

`DataType` = `any`

### ErrorType

`ErrorType` = `any`

## Parameters

### key

[`Key`](../type-aliases/Key.md)

The SWR key to use

### options

[`UseOpenmrsSWROptions`](../type-aliases/UseOpenmrsSWROptions.md) = `{}`

An object of optional parameters to provide, including a [FetchConfig](../interfaces/FetchConfig.md) object
  to pass to [openmrsFetch](openmrsFetch.md) or options to pass to SWR

## Returns

`SWRResponse`\<`FetchResponse`\<`DataType`\>, `ErrorType`, `undefined` \| `SWRConfiguration`\<`FetchResponse`\<`DataType`\>, `ErrorType`, `BareFetcher`\<`FetchResponse`\<`DataType`\>\>\>\>

## Examples

```tsx
import { useOpenmrsSWR } from "@openmrs/esm-framework";

function MyComponent() {
 const { data } = useOpenmrsSWR(key);

 return (
   // render something with data
 );
}
```

Note that if you are using a complex SWR key you must provide a url function to the options parameter,
which translates the key into a URL to be sent to `openmrsFetch()`

```tsx
import { useOpenmrsSWR } from "@openmrs/esm-framework";

function MyComponent() {
 const { data } = useOpenmrsSWR(['key', 'url'], { url: (key) => key[1] });

 return (
   // render something with data
 );
}
```
