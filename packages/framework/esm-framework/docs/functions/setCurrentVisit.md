[O3 Framework](../API.md) / setCurrentVisit

# Function: setCurrentVisit()

> **setCurrentVisit**(`patientUuid`, `visitUuid`): `void`

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:95](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L95)

Sets the current visit for a patient in the global visit store. This is used
to manually specify which visit should be considered "active" for the given patient.

## Parameters

### patientUuid

`string`

The UUID of the patient.

### visitUuid

`string`

The UUID of the visit to set as the current visit.

## Returns

`void`

## Example

```ts
import { setCurrentVisit } from '@openmrs/esm-framework';
setCurrentVisit('patient-uuid', 'visit-uuid');
```
