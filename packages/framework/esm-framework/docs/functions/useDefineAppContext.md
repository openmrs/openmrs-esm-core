[O3 Framework](../API.md) / useDefineAppContext

# Function: useDefineAppContext()

> **useDefineAppContext**\<`T`\>(`namespace`, `value?`): (`update`) => `void`

Defined in: [packages/framework/esm-react-utils/src/useDefineAppContext.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useDefineAppContext.ts#L37)

This hook is used to register a namespace in the AppContext. The component that registers the
namespace is responsible for updating the value associated with the namespace. The namespace
will be automatically removed when the component using this hook is unmounted.

## Type Parameters

### T

`T` *extends* `object` = `object`

The type of the value of the namespace

## Parameters

### namespace

`string`

The name of the namespace in the application context. Note that the namespace
 must be unique among currently registered namespaces in the application context.

### value?

`T`

The value to associate with this namespace. Updating the value property will update
  the namespace value.

## Returns

A function which can be used to update the state associated with the namespace

> (`update`): `void`

### Parameters

#### update

(`state`) => `T`

### Returns

`void`

## Examples

```ts
const { data: patient } = useSWR(`/ws/rest/v1/patient/${patientUuid}`, openmrsFetch);
useDefineAppContext<PatientContext>('patient', patient ?? null);
```

```ts
const { data: patient } = useSWR(`/ws/rest/v1/patient/${patientUuid}`, openmrsFetch);
const updatePatient = useDefineAppContext<PatientContext>('patient', patient ?? null);
updatePatient((patient) => {
 patient.name = 'Hector';
 return patient;
})
```

Note that the AppContext does not allow the storing of undefined values in a namespace. Use `null`
instead.
