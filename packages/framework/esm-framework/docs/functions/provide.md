[O3 Framework](../API.md) / provide

# Function: provide()

> **provide**(`config`, `sourceName`): `void`

Defined in: [packages/framework/esm-config/src/module-config/module-config.ts:279](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/module-config/module-config.ts#L279)

Provides configuration values programmatically. This is an alternative to
providing configuration through the config-file. Configuration provided this
way will be merged with configuration from other sources.

## Parameters

### config

[`Config`](../interfaces/Config.md)

A configuration object to merge into the existing configuration.

### sourceName

`string` = `'provided'`

An optional name to identify the source of this configuration,
  used for debugging purposes. Defaults to 'provided'.

## Returns

`void`
