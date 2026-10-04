[O3 Framework](../API.md) / refetchCurrentUser

# Function: refetchCurrentUser()

> **refetchCurrentUser**(`username?`, `password?`): `Promise`\<[`SessionStore`](../type-aliases/SessionStore.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:251](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L251)

The `refetchCurrentUser` function causes a network request to redownload
the user. All subscribers to the session store will be notified of the
new user once the new version of the user object is downloaded.

If the server rejects the request as unauthenticated (401 or 403), the store records a
logged-out session. If the request fails for any other reason, a session that has already
loaded is kept; otherwise the store records the error.

## Parameters

### username?

`string`

### password?

`string`

## Returns

`Promise`\<[`SessionStore`](../type-aliases/SessionStore.md)\>

A Promise resolving to the updated session store state. It rejects with the
  store state if the request fails for a reason other than authentication.

## Example

```js
import { refetchCurrentUser } from '@openmrs/esm-api'
refetchCurrentUser()
```
