[O3 Framework](../API.md) / ExtensionSlotConfig

# Interface: ExtensionSlotConfig

Defined in: [packages/framework/esm-config/src/types.ts:48](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L48)

## Properties

### add?

> `optional` **add**: `string`[]

Defined in: [packages/framework/esm-config/src/types.ts:50](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L50)

Additional extension IDs to assign to this slot, in addition to those `attach`ed in code.

***

### configure?

> `optional` **configure**: [`ExtensionSlotConfigureValueObject`](ExtensionSlotConfigureValueObject.md)

Defined in: [packages/framework/esm-config/src/types.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L55)

***

### order?

> `optional` **order**: `string`[]

Defined in: [packages/framework/esm-config/src/types.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L54)

Overrides the default ordering of extensions.

***

### remove?

> `optional` **remove**: `string`[]

Defined in: [packages/framework/esm-config/src/types.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L52)

Extension IDs which were `attach`ed to the slot but which should not be assigned.
