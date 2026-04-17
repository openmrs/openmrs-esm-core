[O3 Framework](../API.md) / getVisitStore

# Function: getVisitStore()

> **getVisitStore**(): `StoreApi`\<[`VisitStoreState`](../interfaces/VisitStoreState.md)\>

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L78)

Returns the global visit store that manages the current visit state. The store
contains information about the current patient's visit and provides methods
for subscribing to visit state changes.

## Returns

`StoreApi`\<[`VisitStoreState`](../interfaces/VisitStoreState.md)\>

The global visit store instance.

## Example

```ts
import { getVisitStore } from '@openmrs/esm-framework';
const store = getVisitStore();
const unsubscribe = store.subscribe((state) => {
  console.log('Current patient:', state.patientUuid);
});
```
