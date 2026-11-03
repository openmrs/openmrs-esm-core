[O3 Framework](../API.md) / ExtensionDefinition

# Type Alias: ExtensionDefinition

> **ExtensionDefinition** = `object`

Defined in: [packages/framework/esm-globals/src/types.ts:150](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L150)

A definition of an extension as extracted from an app's routes.json

## Properties

### component

> **component**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:188](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L188)

The name of the component exported by this frontend module.

***

### displayExpression?

> `optional` **displayExpression**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:174](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L174)

The expression that determines whether the extension is displayed.

***

### featureFlag?

> `optional` **featureFlag**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:178](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L178)

If supplied, the extension will only be rendered when this feature flag is enabled.

***

### meta?

> `optional` **meta**: `object`

Defined in: [packages/framework/esm-globals/src/types.ts:182](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L182)

Meta describes any properties that are passed down to the extension when it is loaded

#### Index Signature

\[`k`: `string`\]: `unknown`

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:154](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L154)

The name of this extension. This is used to refer to the extension in configuration.

***

### order?

> `optional` **order**: `number`

Defined in: [packages/framework/esm-globals/src/types.ts:166](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L166)

Determines the order in which this component renders in its default extension slot. Note that this can be overridden by configuration.

***

### privileges?

> `optional` **privileges**: `string` \| `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:170](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L170)

The user must have ANY of these privileges to see this extension.

***

### slot?

> `optional` **slot**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:158](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L158)

If supplied, the slot that this extension is rendered into by default.

***

### slots?

> `optional` **slots**: `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:162](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L162)

If supplied, the slots that this extension is rendered into by default.
