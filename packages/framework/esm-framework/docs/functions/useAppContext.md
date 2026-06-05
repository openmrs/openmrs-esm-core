[O3 Framework](../API.md) / useAppContext

# Function: useAppContext()

## Call Signature

> **useAppContext**\<`T`\>(`namespace`): `undefined` \| `Readonly`\<`T`\>

Defined in: [packages/framework/esm-react-utils/src/useAppContext.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAppContext.ts#L30)

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

The current value registered under `namespace`, or `undefined` when the namespace has not
yet been registered, was unregistered (e.g. the owning component unmounted), or is a blank string.
Consumers should handle the `undefined` case explicitly rather than defaulting to `{}`, since an
empty-object default can mask a genuinely missing namespace and hide bugs.

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

Defined in: [packages/framework/esm-react-utils/src/useAppContext.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAppContext.ts#L60)

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

The selected value, or `undefined` when the namespace has not yet been registered, was
unregistered (e.g. the owning component unmounted), or is a blank string. Consumers should handle
the `undefined` case explicitly rather than defaulting to `{}`, since an empty-object default can
mask a genuinely missing namespace and hide bugs.

### Examples

```ts
// load a full namespace
const patientContext = useAppContext<PatientContext>('patient');
```

```ts
// loads part of a namespace
const patientName = useAppContext<PatientContext, string | undefined>('patient', (state) => state.display);
```
