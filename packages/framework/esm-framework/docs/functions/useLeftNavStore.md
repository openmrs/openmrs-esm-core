[O3 Framework](../API.md) / useLeftNavStore

# Function: useLeftNavStore()

> **useLeftNavStore**(): `LeftNavStore`

Defined in: [packages/framework/esm-react-utils/src/useLeftNavStore.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useLeftNavStore.ts#L20)

A React hook that provides access to the left navigation store state.
The component will re-render whenever the left navigation state changes.

## Returns

`LeftNavStore`

The current state of the left navigation store.

## Example

```tsx
import { useLeftNavStore } from '@openmrs/esm-framework';
function MyComponent() {
  const leftNavState = useLeftNavStore();
  return <div>Current nav: {leftNavState.activeNavName}</div>;
}
```
