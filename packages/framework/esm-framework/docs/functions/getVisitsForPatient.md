[O3 Framework](../API.md) / getVisitsForPatient

# Function: ~~getVisitsForPatient()~~

> **getVisitsForPatient**(`patientUuid`, `abortController`, `v?`): `Promise`\<`FetchResponse`\<\{ `results`: [`Visit`](../interfaces/Visit.md)[]; \}\>\>

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:96](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-emr-api/src/visit-utils.ts#L96)

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
