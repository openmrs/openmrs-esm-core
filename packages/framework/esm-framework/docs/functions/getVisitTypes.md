[O3 Framework](../API.md) / getVisitTypes

# Function: getVisitTypes()

> **getVisitTypes**(): `Observable`\<[`VisitType`](../interfaces/VisitType.md)[]\>

Defined in: [packages/framework/esm-emr-api/src/visit-type.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-type.ts#L29)

Fetches all available visit types from the OpenMRS REST API.

## Returns

`Observable`\<[`VisitType`](../interfaces/VisitType.md)[]\>

An Observable that emits an array of VisitType objects and then completes.
  The Observable will emit exactly one value containing all visit types.

## Example

```ts
import { getVisitTypes } from '@openmrs/esm-framework';
getVisitTypes().subscribe((visitTypes) => {
  console.log('Available visit types:', visitTypes);
});
```
