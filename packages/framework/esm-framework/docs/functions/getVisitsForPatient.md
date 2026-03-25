[O3 Framework](../API.md) / getVisitsForPatient

# Function: ~~getVisitsForPatient()~~

> **getVisitsForPatient**(`patientUuid`, `abortController`, `v?`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<\{ `results`: [`Visit`](../interfaces/Visit.md)[]; \}\>\>

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:180](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L180)

## Parameters

### patientUuid

`string`

### abortController

`AbortController`

### v?

`string`

## Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<\{ `results`: [`Visit`](../interfaces/Visit.md)[]; \}\>\>

## Deprecated

Use the `useVisit` hook instead.
