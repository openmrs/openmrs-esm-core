[@openmrs/esm-framework](../API.md) / VisitStoreState

# Interface: VisitStoreState

## Table of contents

### API Properties

- [manuallySetVisitUuid](VisitStoreState.md#manuallysetvisituuid)
- [mutateVisitCallbacks](VisitStoreState.md#mutatevisitcallbacks)
- [patientUuid](VisitStoreState.md#patientuuid)

## API Properties

### manuallySetVisitUuid

• **manuallySetVisitUuid**: ``null`` \| `string`

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L27)

___

### mutateVisitCallbacks

• **mutateVisitCallbacks**: `Object`

Stores a record of SWR mutate callbacks that should be called when
the Visit with the specified uuid is modified. The callbacks are keyed
by unique component IDs.

#### Index signature

▪ [componentId: `string`]: () => `void`

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L34)

___

### patientUuid

• **patientUuid**: ``null`` \| `string`

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L26)
