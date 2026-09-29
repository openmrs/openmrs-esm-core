[O3 Framework](../API.md) / getCurrentUser

# Function: getCurrentUser()

## Call Signature

> **getCurrentUser**(): `Promise`\<[`Session`](../interfaces/Session.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:91](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L91)

The getCurrentUser function returns a Promise that resolves once with the
current user's session. If the session hasn't been loaded, was loaded more than
a minute ago, or is in the middle of being refetched, the Promise waits for the
fetch in question rather than resolving with data that may be out of date. The
session it resolves with is therefore never more than a minute old, unless that fetch fails,
in which case it resolves with the last session that loaded.

The function accepts an optional `opts` object with an `includeAuthStatus` boolean
property that defaults to `true`. When `true`, the entire [Session](../interfaces/Session.md) object
from the API is provided. When `false`, only the [LoggedInUser](../interfaces/LoggedInUser.md) property of
the response is provided.

To react to subsequent session changes (login, logout, user-property updates),
use [getSessionStore](getSessionStore.md) (`getState()` / `subscribe()`) or the `useSession`
React hook rather than calling this repeatedly.

### Returns

`Promise`\<[`Session`](../interfaces/Session.md)\>

A Promise resolving to a [LoggedInUser](../interfaces/LoggedInUser.md) object (if `includeAuthStatus`
  is `false`) or a [Session](../interfaces/Session.md) object (if `includeAuthStatus` is `true` or not
  provided).

### Example

```js
import { getCurrentUser } from '@openmrs/esm-api'
const session = await getCurrentUser({ includeAuthStatus: true })
console.log(session.authenticated)
```

## Call Signature

> **getCurrentUser**(`opts`): `Promise`\<[`Session`](../interfaces/Session.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:98](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L98)

### Parameters

#### opts

Options for controlling the response format.

##### includeAuthStatus

`true`

When `true`, resolves with the full [Session](../interfaces/Session.md) object
  including authentication status.

### Returns

`Promise`\<[`Session`](../interfaces/Session.md)\>

A Promise resolving to a [Session](../interfaces/Session.md) object.

## Call Signature

> **getCurrentUser**(`opts`): `Promise`\<[`LoggedInUser`](../interfaces/LoggedInUser.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:105](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L105)

### Parameters

#### opts

Options for controlling the response format.

##### includeAuthStatus

`false`

When `false`, resolves with only the [LoggedInUser](../interfaces/LoggedInUser.md) object
  without the surrounding session information.

### Returns

`Promise`\<[`LoggedInUser`](../interfaces/LoggedInUser.md)\>

A Promise resolving to a [LoggedInUser](../interfaces/LoggedInUser.md) object.
