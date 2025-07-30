[O3 Framework](../API.md) / ExtensionDefinition

# Type Alias: ExtensionDefinition

> **ExtensionDefinition** = `object` & \{ `component`: `string`; \} \| \{ `component?`: `never`; \}

Defined in: packages/framework/esm-globals/dist/types.d.ts:169

A definition of an extension as extracted from an app's routes.json

## Type declaration

### featureFlag?

> `optional` **featureFlag**: `string`

If supplied, the extension will only be rendered when this feature flag is enabled.

### meta?

> `optional` **meta**: `object`

Meta describes any properties that are passed down to the extension when it is loaded

#### Index Signature

\[`k`: `string`\]: `unknown`

### name

> **name**: `string`

The name of this extension. This is used to refer to the extension in configuration.

### offline?

> `optional` **offline**: `boolean`

Determines whether the component renders while the browser is not connected to the internet. If false, this page will never render while offline.

### online?

> `optional` **online**: `boolean`

Determines whether the component renders while the browser is connected to the internet. If false, this page will never render while online.

### order?

> `optional` **order**: `number`

Determines the order in which this component renders in its default extension slot. Note that this can be overridden by configuration.

### privileges?

> `optional` **privileges**: `string` \| `string`[]

The user must have ANY of these privileges to see this extension.

### slot?

> `optional` **slot**: `string`

If supplied, the slot that this extension is rendered into by default.

### slots?

> `optional` **slots**: `string`[]

If supplied, the slots that this extension is rendered into by default.
