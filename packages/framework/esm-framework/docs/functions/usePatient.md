[O3 Framework](../API.md) / usePatient

# Function: usePatient()

> **usePatient**(`patientUuid?`): `object`

Defined in: [packages/framework/esm-react-utils/src/usePatient.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/usePatient.ts#L19)

This React hook returns a patient object. If the `patientUuid` is provided
as a parameter, then the patient for that UUID is returned. If the parameter
is not provided, the patient UUID is obtained from the current route, and
a route listener is set up to update the patient whenever the route changes.

## Parameters

### patientUuid?

`string`

## Returns

`object`

### error

> **error**: `undefined` \| `null` \| `Error`

### isLoading

> **isLoading**: `boolean`

### patient

> **patient**: `undefined` \| [`NullablePatient`](../type-aliases/NullablePatient.md)

### patientUuid

> **patientUuid**: `null` \| `string` = `currentPatientUuid`
