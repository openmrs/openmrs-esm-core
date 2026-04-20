[O3 Framework](../API.md) / useAppContext

# Function: useAppContext()

## Call Signature

> **useAppContext**\<`T`\>(`namespace`): `undefined` \| `Readonly`\<`T`\>

Defined in: [packages/framework/esm-react-utils/src/useAppContext.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAppContext.ts#L26)

This hook is used to access a namespace within the overall AppContext, so that a component can
use any shared contextual values. A selector may be provided to further restrict the properties
returned from the namespace.

### Type Parameters

#### T

`T` *extends* `object` = `object`

The type of the value stored in the namespace

### Parameters

#### namespace

`string`

The namespace to load properties from

### Returns

`undefined` \| `Readonly`\<`T`\>

### Examples

```ts
// load a full namespace
const patientContext = useAppContext<PatientContext>('patient');
```

```ts
// loads part of a namespace
const patientName = useAppContext<PatientContext, string | undefined>('patient', (state) => state.display);
```

## Call Signature

> **useAppContext**\<`T`, `U`\>(`namespace`, `selector`): `undefined` \| `Readonly`\<`U`\>

Defined in: [packages/framework/esm-react-utils/src/useAppContext.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAppContext.ts#L52)

This hook is used to access a namespace within the overall AppContext, so that a component can
use any shared contextual values. A selector may be provided to further restrict the properties
returned from the namespace.

### Type Parameters

#### T

`T` *extends* `object` = `object`

The type of the value stored in the namespace

#### U

`U` = `T`

The return type of this hook which is mostly relevant when using a selector

### Parameters

#### namespace

`string`

The namespace to load properties from

#### selector

(`state`) => `Readonly`\<`U`\>

An optional function which extracts the relevant part of the state

### Returns

`undefined` \| `Readonly`\<`U`\>

### Examples

```ts
// load a full namespace
const patientContext = useAppContext<PatientContext>('patient');
```

```ts
// loads part of a namespace
const patientName = useAppContext<PatientContext, string | undefined>('patient', (state) => state.display);
```
