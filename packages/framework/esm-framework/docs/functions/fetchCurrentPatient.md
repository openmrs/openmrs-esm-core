[O3 Framework](../API.md) / fetchCurrentPatient

# Function: fetchCurrentPatient()

> **fetchCurrentPatient**(`patientUuid`, `fetchInit?`): `Promise`\<`null` \| `Patient`\>

Defined in: [packages/framework/esm-emr-api/src/current-patient.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/current-patient.ts#L38)

Fetches a patient by their UUID from the FHIR API.

## Parameters

### patientUuid

[`PatientUuid`](../type-aliases/PatientUuid.md)

The UUID of the patient to fetch, or `null`.

### fetchInit?

[`FetchConfig`](../interfaces/FetchConfig.md)

Optional fetch configuration options to pass to the request.

## Returns

`Promise`\<`null` \| `Patient`\>

A Promise that resolves with the FHIR Patient object, or `null` if
  the patient UUID is null.

## Throws

Rethrows any error from the server request.

## Example

```ts
import { fetchCurrentPatient } from '@openmrs/esm-framework';
const patient = await fetchCurrentPatient('patient-uuid');
if (patient) {
  console.log('Patient name:', patient.name?.[0]?.text);
}
```
