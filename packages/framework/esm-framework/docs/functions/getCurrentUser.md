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

### Returns

`Observable`\<[`Session`](../interfaces/Session.md)\>

An Observable that produces zero or more values (as
  described above). The values produced will be a user object (if
  `includeAuthStatus` is set to `false`) or an object with a session
  and authenticated property (if `includeAuthStatus` is set to `true`).

#### Example

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

Defined in: [packages/framework/esm-api/src/current-user.ts:67](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L67)

The getCurrentUser function returns an observable that produces
**zero or more values, over time**. It will produce zero values
by default if the user is not logged in. And it will provide a
first value when the logged in user is fetched from the server.
Subsequent values will be produced whenever the user object is
updated.

### Parameters

#### opts

An object with `includeAuthStatus` boolean
  property that defaults to `false`. When `includeAuthStatus` is set
  to `true`, the entire response object from the API will be provided.
  When `includeAuthStatus` is set to `false`, only the `user` property
  of the response object will be provided.

##### includeAuthStatus

`true`

### Returns

`Observable`\<[`Session`](../interfaces/Session.md)\>

An Observable that produces zero or more values (as
  described above). The values produced will be a user object (if
  `includeAuthStatus` is set to `false`) or an object with a session
  and authenticated property (if `includeAuthStatus` is set to `true`).

#### Example

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

> **getCurrentUser**(`opts`): `Observable`\<[`LoggedInUser`](../interfaces/LoggedInUser.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:68](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L68)

The getCurrentUser function returns an observable that produces
**zero or more values, over time**. It will produce zero values
by default if the user is not logged in. And it will provide a
first value when the logged in user is fetched from the server.
Subsequent values will be produced whenever the user object is
updated.

### Parameters

#### opts

An object with `includeAuthStatus` boolean
  property that defaults to `false`. When `includeAuthStatus` is set
  to `true`, the entire response object from the API will be provided.
  When `includeAuthStatus` is set to `false`, only the `user` property
  of the response object will be provided.

##### includeAuthStatus

`false`

### Returns

`Observable`\<[`LoggedInUser`](../interfaces/LoggedInUser.md)\>

An Observable that produces zero or more values (as
  described above). The values produced will be a user object (if
  `includeAuthStatus` is set to `false`) or an object with a session
  and authenticated property (if `includeAuthStatus` is set to `true`).

#### Example

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
