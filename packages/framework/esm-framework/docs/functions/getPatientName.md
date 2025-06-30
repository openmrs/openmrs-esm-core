[O3 Framework](../API.md) / getPatientName

# Function: getPatientName()

> **getPatientName**(`patient`): `string`

Defined in: packages/framework/esm-utils/dist/patient-helpers.d.ts:12

Gets the formatted display name for a patient.

The display name will be taken from the patient's 'usual' name,
or may fall back to the patient's 'official' name.

## Parameters

### patient

`Patient`

The patient details in FHIR format.

## Returns

`string`

The patient's display name or an empty string if name is not present.
