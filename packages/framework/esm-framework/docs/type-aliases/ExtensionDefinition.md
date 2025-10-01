[O3 Framework](../API.md) / ExtensionDefinition

# Type Alias: ExtensionDefinition

> **ExtensionDefinition** = `object`

Defined in: packages/framework/esm-globals/dist/types.d.ts:168

A definition of an extension as extracted from an app's routes.json

## Properties

### component

> **component**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:214

The name of the component exported by this frontend module.

***

### displayExpression?

> `optional` **displayExpression**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:200

The expression that determines whether the extension is displayed.

***

### featureFlag?

> `optional` **featureFlag**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:204

If supplied, the extension will only be rendered when this feature flag is enabled.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/framework/esm-globals/dist/types.d.ts:208

Meta describes any properties that are passed down to the extension when it is loaded

#### Index Signature

\[`k`: `string`\]: `unknown`

***

### name

> **name**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:172

The name of this extension. This is used to refer to the extension in configuration.

***

### offline?

> `optional` **offline**: `boolean`

Defined in: packages/framework/esm-globals/dist/types.d.ts:188

Determines whether the component renders while the browser is not connected to the internet. If false, this page will never render while offline.

***

### online?

> `optional` **online**: `boolean`

Defined in: packages/framework/esm-globals/dist/types.d.ts:184

Determines whether the component renders while the browser is connected to the internet. If false, this page will never render while online.

***

### order?

> `optional` **order**: `number`

Defined in: packages/framework/esm-globals/dist/types.d.ts:192

Determines the order in which this component renders in its default extension slot. Note that this can be overridden by configuration.

***

### privileges?

> `optional` **privileges**: `string` \| `string`[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:196

The user must have ANY of these privileges to see this extension.

***

### slot?

> `optional` **slot**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:176

If supplied, the slot that this extension is rendered into by default.

***

### slots?

> `optional` **slots**: `string`[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:180

If supplied, the slots that this extension is rendered into by default.
