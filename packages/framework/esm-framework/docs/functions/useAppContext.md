[O3 Framework](../API.md) / useAppContext

# Function: useAppContext()

> **useAppContext**\<`T`\>(`namespace`): `undefined` \| `Readonly`\<`T`\>

Defined in: [packages/framework/esm-react-utils/src/useAppContext.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useAppContext.ts#L26)

This hook is used to access a namespace within the overall AppContext, so that a component can
use any shared contextual values. A selector may be provided to further restrict the properties
returned from the namespace.

## Type Parameters

### T

`T` *extends* `object` = \{ \}

The type of the value stored in the namespace

## Parameters

### namespace

`string`

The namespace to load properties from

## Returns

`undefined` \| `Readonly`\<`T`\>

## Examples

```ts
// load a full namespace
const patientContext = useAppContext<PatientContext>('patient');
```

```ts
// loads part of a namespace
const patientName = useAppContext<PatientContext, string | undefined>('patient', (state) => state.display);
```

```ts
// load a full namespace
const patientContext = useAppContext<PatientContext>('patient');
```

```ts
// loads part of a namespace
const patientName = useAppContext<PatientContext, string | undefined>('patient', (state) => state.display);
```

## Type Param

The type of the value stored in the namespace

## Type Param

The return type of this hook which is mostly relevant when using a selector

## Param

The namespace to load properties from

## Param

An optional function which extracts the relevant part of the state
