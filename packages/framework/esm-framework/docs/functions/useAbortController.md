[O3 Framework](../API.md) / useAbortController

# Function: useAbortController()

> **useAbortController**(): `AbortController`

Defined in: [packages/framework/esm-react-utils/src/useAbortController.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAbortController.ts#L25)

**`Beta`**

This hook creates an AbortController that lasts either until the previous AbortController
is aborted or until the component unmounts. This can be used to ensure that all fetch requests
are cancelled when a component is unmounted.

## Returns

`AbortController`

## Example

```tsx
import { useAbortController } from "@openmrs/esm-framework";

function MyComponent() {
 const abortController = useAbortController();
 const { data } = useSWR(key, (key) => openmrsFetch(key, { signal: abortController.signal }));

 return (
   // render something with data
 );
}
```
