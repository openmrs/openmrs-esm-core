[O3 Framework](../API.md) / VisitStoreState

# Interface: VisitStoreState

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L25)

## Properties

### manuallySetVisitUuid

> **manuallySetVisitUuid**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L27)

***

### mutateVisitCallbacks

> **mutateVisitCallbacks**: `object`

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L34)

Stores a record of SWR mutate callbacks that should be called when
the Visit with the specified uuid is modified. The callbacks are keyed
by unique component IDs.

#### Index Signature

\[`componentId`: `string`\]: () => `void`

***

### patientUuid

> **patientUuid**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L26)
