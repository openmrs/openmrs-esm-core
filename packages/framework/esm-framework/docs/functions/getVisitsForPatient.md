[O3 Framework](../API.md) / getVisitsForPatient

# Function: ~~getVisitsForPatient()~~

> **getVisitsForPatient**(`patientUuid`, `abortController`, `v?`): `Promise`\<`FetchResponse`\<\{ `results`: [`Visit`](../interfaces/Visit.md)[]; \}\>\>

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:110](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L110)

## Parameters

### patientUuid

`string`

### abortController

`AbortController`

### v?

`string`

## Returns

`Promise`\<`FetchResponse`\<\{ `results`: [`Visit`](../interfaces/Visit.md)[]; \}\>\>

## Deprecated

Use the `useVisit` hook instead.
