[O3 Framework](../API.md) / setSessionLocation

# Function: setSessionLocation()

> **setSessionLocation**(`locationUuid`, `abortController`): `Promise`\<`any`\>

Defined in: [packages/framework/esm-api/src/current-user.ts:351](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L351)

Sets the session location for the current user. The session location represents
the physical location where the user is working (e.g., a clinic or ward).
This triggers a server request to update the session and refreshes the local
session store.

## Parameters

### locationUuid

`string`

The UUID of the location to set as the session location.

### abortController

`AbortController`

An AbortController to allow cancellation of the request.

## Returns

`Promise`\<`any`\>

A Promise that resolves with the updated SessionStore.

## Example

```ts
import { setSessionLocation } from '@openmrs/esm-api';
const abortController = new AbortController();
await setSessionLocation('location-uuid-here', abortController);
```
