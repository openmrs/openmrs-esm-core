[O3 Framework](../API.md) / usePatient

# Function: usePatient()

> **usePatient**(`patientUuid?`): `object`

Defined in: [packages/framework/esm-react-utils/src/usePatient.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/usePatient.ts#L24)

This React hook returns a patient object. If the `patientUuid` is provided
as a parameter, then the patient for that UUID is returned. If the parameter
is not provided, the patient UUID is obtained from the current route, and
a route listener is set up to update the patient whenever the route changes.

## Parameters

### patientUuid?

`string`

Optional UUID of the patient to fetch. If not provided,
  the UUID is extracted from the current URL path.

## Returns

`object`

An object containing the patient data, loading state, current patient UUID, and any error.

### error

> **error**: `undefined` \| `null` \| `Error`

### isLoading

> **isLoading**: `boolean`

### patient

> **patient**: `undefined` \| [`NullablePatient`](../type-aliases/NullablePatient.md)

### patientUuid

> **patientUuid**: `null` \| `string` = `currentPatientUuid`
