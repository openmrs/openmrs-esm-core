[O3 Framework](../API.md) / ExtensionDefinition

# Type Alias: ExtensionDefinition

> **ExtensionDefinition** = `object`

Defined in: [packages/framework/esm-globals/src/types.ts:165](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L165)

A definition of an extension as extracted from an app's routes.json

## Properties

### component

> **component**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:211](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L211)

The name of the component exported by this frontend module.

***

### displayExpression?

> `optional` **displayExpression**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:197](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L197)

The expression that determines whether the extension is displayed.

***

### featureFlag?

> `optional` **featureFlag**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:201](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L201)

If supplied, the extension will only be rendered when this feature flag is enabled.

***

### meta?

> `optional` **meta**: `object`

Defined in: [packages/framework/esm-globals/src/types.ts:205](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L205)

Meta describes any properties that are passed down to the extension when it is loaded

#### Index Signature

\[`k`: `string`\]: `unknown`

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:169](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L169)

The name of this extension. This is used to refer to the extension in configuration.

***

### offline?

> `optional` **offline**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:185](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L185)

Determines whether the component renders while the browser is not connected to the internet. If false, this page will never render while offline.

***

### online?

> `optional` **online**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:181](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L181)

Determines whether the component renders while the browser is connected to the internet. If false, this page will never render while online.

***

### order?

> `optional` **order**: `number`

Defined in: [packages/framework/esm-globals/src/types.ts:189](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L189)

Determines the order in which this component renders in its default extension slot. Note that this can be overridden by configuration.

***

### privileges?

> `optional` **privileges**: `string` \| `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:193](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L193)

The user must have ANY of these privileges to see this extension.

***

### slot?

> `optional` **slot**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:173](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L173)

If supplied, the slot that this extension is rendered into by default.

***

### slots?

> `optional` **slots**: `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:177](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L177)

If supplied, the slots that this extension is rendered into by default.
