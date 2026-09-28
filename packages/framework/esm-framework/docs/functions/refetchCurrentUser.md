[O3 Framework](../API.md) / refetchCurrentUser

# Function: refetchCurrentUser()

> **refetchCurrentUser**(`username?`, `password?`): `Promise`\<[`SessionStore`](../type-aliases/SessionStore.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:223](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L223)

The `refetchCurrentUser` function causes a network request to redownload
the user. All subscribers to the session store will be notified of the
new user once the new version of the user object is downloaded.

## Parameters

### username?

`string`

### password?

`string`

## Returns

`Promise`\<[`SessionStore`](../type-aliases/SessionStore.md)\>

A Promise resolving to the updated session store state.

## Example

```js
import { refetchCurrentUser } from '@openmrs/esm-api'
refetchCurrentUser()
```
