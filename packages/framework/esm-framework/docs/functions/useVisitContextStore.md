[O3 Framework](../API.md) / useVisitContextStore

# Function: useVisitContextStore()

> **useVisitContextStore**(`mutateVisitCallback?`): `VisitStoreState` & `BindFunctionsIn`\<\{ `mutateVisit`: \{ \}; `setVisitContext`: \{ `manuallySetVisitUuid`: `null`; `patientUuid?`: `undefined`; \} \| \{ `manuallySetVisitUuid`: `string`; `patientUuid`: `undefined` \| `string`; \}; \}\>

Defined in: [packages/framework/esm-react-utils/src/useVisitContextStore.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisitContextStore.ts#L30)

A hook to return the visit context store and corresponding actions.

## Parameters

### mutateVisitCallback?

() => `void`

An optional mutate callback to register. If provided, the
store action's `mutateVisit` function will invoke this callback (along with any other
callbacks also registered into the store)

## Returns

`VisitStoreState` & `BindFunctionsIn`\<\{ `mutateVisit`: \{ \}; `setVisitContext`: \{ `manuallySetVisitUuid`: `null`; `patientUuid?`: `undefined`; \} \| \{ `manuallySetVisitUuid`: `string`; `patientUuid`: `undefined` \| `string`; \}; \}\>
