[O3 Framework](../API.md) / ExtensionDefinition

# Type Alias: ExtensionDefinition

> **ExtensionDefinition** = `object`

Defined in: [packages/framework/esm-globals/src/types.ts:168](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L168)

A definition of an extension as extracted from an app's routes.json

## Properties

### component

> **component**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:214](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L214)

The name of the component exported by this frontend module.

***

### displayExpression?

> `optional` **displayExpression**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:200](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L200)

The expression that determines whether the extension is displayed.

***

### featureFlag?

> `optional` **featureFlag**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:204](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L204)

If supplied, the extension will only be rendered when this feature flag is enabled.

***

### meta?

> `optional` **meta**: `object`

Defined in: [packages/framework/esm-globals/src/types.ts:208](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L208)

Meta describes any properties that are passed down to the extension when it is loaded

#### Index Signature

\[`k`: `string`\]: `unknown`

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:172](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L172)

The name of this extension. This is used to refer to the extension in configuration.

***

### offline?

> `optional` **offline**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:188](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L188)

Determines whether the component renders while the browser is not connected to the internet. If false, this page will never render while offline.

***

### online?

> `optional` **online**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:184](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L184)

Determines whether the component renders while the browser is connected to the internet. If false, this page will never render while online.

***

### order?

> `optional` **order**: `number`

Defined in: [packages/framework/esm-globals/src/types.ts:192](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L192)

Determines the order in which this component renders in its default extension slot. Note that this can be overridden by configuration.

***

### privileges?

> `optional` **privileges**: `string` \| `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:196](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L196)

The user must have ANY of these privileges to see this extension.

***

### slot?

> `optional` **slot**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:176](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L176)

If supplied, the slot that this extension is rendered into by default.

***

### slots?

> `optional` **slots**: `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:180](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L180)

If supplied, the slots that this extension is rendered into by default.
