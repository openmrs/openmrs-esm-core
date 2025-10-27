[O3 Framework](../API.md) / defineConfigSchema

# Function: defineConfigSchema()

> **defineConfigSchema**(`moduleName`, `schema`): `void`

Defined in: [packages/framework/esm-config/src/module-config/module-config.ts:177](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/module-config/module-config.ts#L177)

This defines a configuration schema for a module. The schema tells the
configuration system how the module can be configured. It specifies
what makes configuration valid or invalid.

See [Configuration System](https://o3-docs.openmrs.org/docs/configuration-system)
for more information about defining a config schema.

## Parameters

### moduleName

`string`

Name of the module the schema is being defined for. Generally
  should be the one in which the `defineConfigSchema` call takes place.

### schema

[`ConfigSchema`](../interfaces/ConfigSchema.md)

The config schema for the module

## Returns

`void`
