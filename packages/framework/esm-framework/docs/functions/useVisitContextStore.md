[O3 Framework](../API.md) / useVisitContextStore

# Function: useVisitContextStore()

> **useVisitContextStore**(`mutateVisitCallback?`): `object`

Defined in: [packages/framework/esm-react-utils/src/useVisitContextStore.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisitContextStore.ts#L44)

A hook to return the visit context store and corresponding actions.

## Parameters

### mutateVisitCallback?

() => `void`

An optional mutate callback to register. If provided, the
returned `mutateVisit` function will invoke this callback (along with any other
callbacks registered by other components). Pass a callback with a stable identity;
one that changes on every render re-registers on every render.

## Returns

### manuallySetVisitUuid

> **manuallySetVisitUuid**: `null` \| `string`

### mutateVisit()

> **mutateVisit**: () => `void`

Invokes every registered mutate callback, revalidating visit data across the application.

Iterates over a copy so that a callback which registers or unregisters another does not
disturb the traversal.

#### Returns

`void`

### patientUuid

> **patientUuid**: `null` \| `string`

### setVisitContext()

> **setVisitContext**(...`args`): `void`

#### Parameters

##### args

...\[`null` \| [`Visit`](../interfaces/Visit.md)\]

#### Returns

`void`
