[O3 Framework](../API.md) / registerContext

# Function: registerContext()

> **registerContext**\<`T`\>(`namespace`, `initialValue`): `void`

Defined in: [packages/framework/esm-context/src/context.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/18d2874f03a33a6ab8295af0e87ac97fdd150718/packages/framework/esm-context/src/context.ts#L29)

Used by callers to register a new namespace in the application context. Attempting to register
an already-registered namespace will display a warning and make no modifications to the state.

## Type Parameters

### T

`T` *extends* `object` = \{ \}

## Parameters

### namespace

`string`

the namespace to register

### initialValue

`T` = `nothing`

the initial value of the namespace

## Returns

`void`
