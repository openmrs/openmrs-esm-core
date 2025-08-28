[O3 Framework](../API.md) / defineExtensionConfigSchema

# Function: defineExtensionConfigSchema()

> **defineExtensionConfigSchema**(`extensionName`, `schema`): `void`

Defined in: [packages/framework/esm-config/src/module-config/module-config.ts:241](https://github.com/its-kios09/openmrs-esm-core/blob/main/packages/framework/esm-config/src/module-config/module-config.ts#L241)

This defines a configuration schema for an extension. When a schema is defined
for an extension, that extension will receive the configuration corresponding
to that schema, rather than the configuration corresponding to the module
in which it is defined.

The schema tells the configuration system how the module can be configured.
It specifies what makes configuration valid or invalid.

See [Configuration System](https://o3-docs.openmrs.org/docs/configuration-system)
for more information about defining a config schema.

## Parameters

### extensionName

`string`

Name of the extension the schema is being defined for.
  Should match the `name` of one of the `extensions` entries being returned
  by `setupOpenMRS`.

### schema

[`ConfigSchema`](../interfaces/ConfigSchema.md)

The config schema for the extension

## Returns

`void`
