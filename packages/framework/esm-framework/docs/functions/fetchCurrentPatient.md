[O3 Framework](../API.md) / fetchCurrentPatient

# Function: fetchCurrentPatient()

> **fetchCurrentPatient**(`patientUuid`, `fetchInit?`, `includeOfflinePatients?`): `Promise`\<`null` \| `Patient`\>

Defined in: [packages/framework/esm-emr-api/src/current-patient.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/current-patient.ts#L44)

Fetches a patient by their UUID from the FHIR API. This function first attempts
to fetch the patient from the server. If the server request fails and offline
patients are included, it will check for a matching patient in the offline
patient registration sync queue.

## Parameters

### patientUuid

[`PatientUuid`](../type-aliases/PatientUuid.md)

The UUID of the patient to fetch, or `null`.

### fetchInit?

`FetchConfig`

Optional fetch configuration options to pass to the request.

### includeOfflinePatients?

`boolean` = `true`

Whether to include patients from the offline
  registration queue if the server request fails. Defaults to `true`.

## Returns

`Promise`\<`null` \| `Patient`\>

A Promise that resolves with the FHIR Patient object, or `null` if
  the patient UUID is null or the patient is not found.

## Throws

Rethrows any error from the server request if no offline patient is found.

## Example

```ts
import { fetchCurrentPatient } from '@openmrs/esm-framework';
const patient = await fetchCurrentPatient('patient-uuid');
if (patient) {
  console.log('Patient name:', patient.name?.[0]?.text);
}
```
