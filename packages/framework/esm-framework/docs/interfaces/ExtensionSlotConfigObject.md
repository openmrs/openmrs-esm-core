[O3 Framework](../API.md) / ExtensionSlotConfigObject

# Interface: ExtensionSlotConfigObject

Defined in: [packages/framework/esm-config/src/types.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L59)

## Properties

### add?

> `optional` **add**: `string`[]

Defined in: [packages/framework/esm-config/src/types.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L61)

Additional extension IDs to assign to this slot, in addition to those `attach`ed in code.

***

### order?

> `optional` **order**: `string`[]

Defined in: [packages/framework/esm-config/src/types.ts:65](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L65)

Overrides the default ordering of extensions.

***

### remove?

> `optional` **remove**: `string`[]

Defined in: [packages/framework/esm-config/src/types.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L63)

Extension IDs which were `attach`ed to the slot but which should not be assigned.
