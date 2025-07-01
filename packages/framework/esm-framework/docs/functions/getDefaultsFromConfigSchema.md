[O3 Framework](../API.md) / getDefaultsFromConfigSchema

# Function: getDefaultsFromConfigSchema()

> **getDefaultsFromConfigSchema**\<`T`\>(`schema`): `T`

Defined in: packages/framework/esm-utils/dist/test-helpers.d.ts:12

Given a config schema, this returns an object like is returned by `useConfig`
with all default values.

This should be used in tests and not in production code.

If all you need is the default values in your tests, these are returned by
default from the `useConfig`/`getConfig` mock. This function is useful if you
need to override some of the default values.

## Type Parameters

### T

`T` = `Record`\<`string`, `any`\>

## Parameters

### schema

`Record`\<`string` \| `number` \| `symbol`, `unknown`\>

## Returns

`T`
