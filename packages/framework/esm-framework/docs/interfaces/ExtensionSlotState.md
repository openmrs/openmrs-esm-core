[O3 Framework](../API.md) / ExtensionSlotState

# Interface: ExtensionSlotState

Defined in: [packages/framework/esm-extensions/src/store.ts:103](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L103)

## Properties

### candidateExtensions

> **candidateExtensions**: [`AssignedExtension`](AssignedExtension.md)[]

Defined in: [packages/framework/esm-extensions/src/store.ts:109](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L109)

Candidates only. Call `getAssignedExtensions()` for the extensions a given rendering of
this slot should actually display.

***

### moduleName?

> `optional` **moduleName**: `string`

Defined in: [packages/framework/esm-extensions/src/store.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L104)
