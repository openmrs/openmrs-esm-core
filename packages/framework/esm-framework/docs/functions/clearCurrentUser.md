[O3 Framework](../API.md) / clearCurrentUser

# Function: clearCurrentUser()

> **clearCurrentUser**(): `void`

Defined in: [packages/framework/esm-api/src/current-user.ts:230](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L230)

Clears the current user session from the session store, setting the session
to an unauthenticated state. This is typically called during logout to reset
the application's authentication state.

## Returns

`void`

## Example

```ts
import { clearCurrentUser } from '@openmrs/esm-api';
// During logout
clearCurrentUser();
```
