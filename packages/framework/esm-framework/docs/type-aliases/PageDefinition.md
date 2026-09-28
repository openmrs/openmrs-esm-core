[O3 Framework](../API.md) / PageDefinition

# Type Alias: PageDefinition

> **PageDefinition** = `object` & \{ `route`: `string` \| `boolean`; `routeRegex?`: `never`; \} \| \{ `route?`: `never`; `routeRegex`: `string`; \}

Defined in: [packages/framework/esm-globals/src/types.ts:97](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L97)

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
