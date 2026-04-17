[O3 Framework](../API.md) / getCurrentUser

# Function: getCurrentUser()

## Call Signature

> **getCurrentUser**(): `Observable`\<[`Session`](../interfaces/Session.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L66)

The getCurrentUser function returns an observable that produces
**zero or more values, over time**. It will produce zero values
by default if the user is not logged in. And it will provide a
first value when the logged in user is fetched from the server.
Subsequent values will be produced whenever the user object is
updated.

The function accepts an optional `opts` object with an `includeAuthStatus`
boolean property that defaults to `true`. When `includeAuthStatus` is `true`,
the entire [Session](../interfaces/Session.md) object from the API will be provided. When
`includeAuthStatus` is `false`, only the [LoggedInUser](../interfaces/LoggedInUser.md) property of the
response object will be provided.

### Returns

`Observable`\<[`Session`](../interfaces/Session.md)\>

An Observable that produces zero or more values (as described above).
  The values produced will be a [LoggedInUser](../interfaces/LoggedInUser.md) object (if `includeAuthStatus`
  is set to `false`) or a [Session](../interfaces/Session.md) object with authentication status
  (if `includeAuthStatus` is set to `true` or not provided).

### Example

```js
import { getCurrentUser } from '@openmrs/esm-api'
const subscription = getCurrentUser().subscribe(
  user => console.log(user)
)
subscription.unsubscribe()
getCurrentUser({includeAuthStatus: true}).subscribe(
  data => console.log(data.authenticated)
)
```

#### Be sure to unsubscribe when your component unmounts

Otherwise your code will continue getting updates to the user object
even after the UI component is gone from the screen. This is a memory
leak and source of bugs.

## Call Signature

> **getCurrentUser**(`opts`): `Observable`\<[`Session`](../interfaces/Session.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:73](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L73)

### Parameters

#### opts

Options for controlling the response format.

##### includeAuthStatus

`true`

When `true`, returns the full [Session](../interfaces/Session.md) object
  including authentication status.

### Returns

`Observable`\<[`Session`](../interfaces/Session.md)\>

An Observable that produces [Session](../interfaces/Session.md) objects.

## Call Signature

> **getCurrentUser**(`opts`): `Observable`\<[`LoggedInUser`](../interfaces/LoggedInUser.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L80)

### Parameters

#### opts

Options for controlling the response format.

##### includeAuthStatus

`false`

When `false`, returns only the [LoggedInUser](../interfaces/LoggedInUser.md) object
  without the surrounding session information.

### Returns

`Observable`\<[`LoggedInUser`](../interfaces/LoggedInUser.md)\>

An Observable that produces [LoggedInUser](../interfaces/LoggedInUser.md) objects.
