[O3 Framework](../API.md) / shallowEqual

# Function: shallowEqual()

> **shallowEqual**(`a`, `b`): `boolean`

Defined in: packages/framework/esm-utils/dist/shallowEqual.d.ts:12

Checks whether two objects are equal, using a shallow comparison, similar to React.

In essence, shallowEquals ensures two objects have the same own properties and that the values
of these are equal (===) to each other.

## Parameters

### a

`unknown`

The first value to compare

### b

`unknown`

The second value to compare

## Returns

`boolean`

true if the objects are shallowly equal to each other
