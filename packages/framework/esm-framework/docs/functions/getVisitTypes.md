[O3 Framework](../API.md) / getVisitTypes

# Function: getVisitTypes()

> **getVisitTypes**(`url`): `Promise`\<[`VisitType`](../interfaces/VisitType.md)[]\>

Defined in: [packages/framework/esm-emr-api/src/visit-type.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-type.ts#L30)

Fetches all available visit types from the OpenMRS REST API.

## Parameters

### url

`string` = `visitTypesUrl`

The endpoint to read from, defaulting to [visitTypesUrl](../variables/visitTypesUrl.md). This exists so that the
  function can be passed straight to SWR as a fetcher, which calls it with the cache key.

## Returns

`Promise`\<[`VisitType`](../interfaces/VisitType.md)[]\>

A Promise that resolves with an array of VisitType objects.

## Example

```ts
import { getVisitTypes } from '@openmrs/esm-framework';
const visitTypes = await getVisitTypes();
console.log('Available visit types:', visitTypes);
```
