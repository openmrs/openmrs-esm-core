[O3 Framework](../API.md) / PageDefinition

# Type Alias: PageDefinition

> **PageDefinition** = `object` & \{ `route`: `string` \| `boolean`; `routeRegex?`: `never`; \} \| \{ `route?`: `never`; `routeRegex`: `string`; \}

Defined in: packages/framework/esm-globals/dist/types.d.ts:112

A definition of a page extracted from an app's routes.json

## Type declaration

### component

> **component**: `string`

The name of the component exported by this frontend module.

### containerDomId?

> `optional` **containerDomId**: `string`

If supplied, the page will be rendered within the DOM element with the specified ID. Defaults to "omrs-apps-container" if not supplied.

### featureFlag?

> `optional` **featureFlag**: `string`

If supplied, the page will only be rendered when this feature flag is enabled.

### offline?

> `optional` **offline**: `boolean`

Determines whether the component renders while the browser is not connected to the internet. If false, this page will never render while offline.

### online?

> `optional` **online**: `boolean`

Determines whether the component renders while the browser is connected to the internet. If false, this page will never render while online.
