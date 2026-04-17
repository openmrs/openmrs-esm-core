[O3 Framework](../API.md) / getSessionStore

# Function: getSessionStore()

> **getSessionStore**(): `StoreApi`\<[`SessionStore`](../type-aliases/SessionStore.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:123](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L123)

Returns the global session store containing the current user's session information.
If the session data is stale (older than 1 minute) or not yet loaded, this function
will trigger a refetch of the current user's session.

## Returns

`StoreApi`\<[`SessionStore`](../type-aliases/SessionStore.md)\>

The global session store that can be subscribed to for session updates.

## Example

```ts
import { getSessionStore } from '@openmrs/esm-api';
const store = getSessionStore();
const unsubscribe = store.subscribe((state) => {
  if (state.loaded) {
    console.log('Session:', state.session);
  }
});
```
