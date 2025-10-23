[O3 Framework](../API.md) / getConfig

# Function: getConfig()

> **getConfig**\<`T`\>(`moduleName`): `Promise`\<`T`\>

Defined in: [packages/framework/esm-config/src/module-config/module-config.ts:286](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/module-config/module-config.ts#L286)

A promise-based way to access the config as soon as it is fully loaded.
If it is already loaded, resolves the config in its present state.

This is a useful function if you need to get the config in the course
of the execution of a function.

## Type Parameters

### T

`T` = `Record`\<`string`, `any`\>

## Parameters

### moduleName

`string`

The name of the module for which to look up the config

## Returns

`Promise`\<`T`\>
