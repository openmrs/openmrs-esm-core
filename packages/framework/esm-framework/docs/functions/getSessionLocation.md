[O3 Framework](../API.md) / getSessionLocation

# Function: getSessionLocation()

> **getSessionLocation**(): `Promise`\<`undefined` \| [`SessionLocation`](../interfaces/SessionLocation.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:325](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L325)

Returns a Promise that resolves with the current session location, if one is set.
The session location represents the physical location where the user is currently
working (e.g., a clinic or ward).

## Returns

`Promise`\<`undefined` \| [`SessionLocation`](../interfaces/SessionLocation.md)\>

A Promise that resolves with the SessionLocation object, or `undefined`
  if no session location is set.

## Example

```ts
import { getSessionLocation } from '@openmrs/esm-api';
const location = await getSessionLocation();
if (location) {
  console.log('Current location:', location.display);
}
```
