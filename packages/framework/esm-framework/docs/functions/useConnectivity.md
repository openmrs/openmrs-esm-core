[O3 Framework](../API.md) / useConnectivity

# Function: useConnectivity()

> **useConnectivity**(): `boolean`

Defined in: [packages/framework/esm-react-utils/src/useConnectivity.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useConnectivity.ts#L22)

A React hook that returns the current online/offline status and automatically
updates when connectivity changes. Useful for showing offline indicators or
conditionally rendering UI based on network availability.

## Returns

`boolean`

`true` if the browser is online, `false` if offline.

## Example

```tsx
import { useConnectivity } from '@openmrs/esm-framework';
function NetworkStatus() {
  const isOnline = useConnectivity();
  return <span>{isOnline ? 'Online' : 'Offline'}</span>;
}
```
