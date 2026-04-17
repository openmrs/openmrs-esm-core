[O3 Framework](../API.md) / getLoggedInUser

# Function: getLoggedInUser()

> **getLoggedInUser**(): `Promise`\<[`LoggedInUser`](../interfaces/LoggedInUser.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:287](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L287)

Returns a Promise that resolves with the currently logged-in user object.
If the user is already loaded in the session store, the Promise resolves immediately.
Otherwise, it subscribes to the session store and resolves when a logged-in user
becomes available.

## Returns

`Promise`\<[`LoggedInUser`](../interfaces/LoggedInUser.md)\>

A Promise that resolves with the LoggedInUser object once available.

## Example

```ts
import { getLoggedInUser } from '@openmrs/esm-api';
const user = await getLoggedInUser();
console.log('Logged in as:', user.display);
```
