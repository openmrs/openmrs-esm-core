[O3 Framework](../API.md) / OpenmrsAppContext

# Function: OpenmrsAppContext()

> **OpenmrsAppContext**\<`T`\>(`__namedParameters`): `null`

Defined in: [packages/framework/esm-react-utils/src/OpenmrsContext.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/OpenmrsContext.ts#L24)

OpenmrsAppContext is a simple React component meant to function similarly to React's Context,
but built on top of the OpenmrsAppContext.

## Type Parameters

### T

`T` *extends* `object` = `object`

## Parameters

### \_\_namedParameters

[`OpenmrsAppContextProps`](../interfaces/OpenmrsAppContextProps.md)\<`T`\>

## Returns

`null`

## Example

```ts
   <OpenmrsAppContext namespace="something" value={{ key: "1234" }} />
```

**Notes on usage:** Unlike a proper React context where the value is limited to the subtree under the
context component, the `OpenmrsAppContext` is inherently global in scope. That means that _all applications_
will see the values that you set for the namespace if they load the value of the namespace.
