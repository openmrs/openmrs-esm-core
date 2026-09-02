[O3 Framework](../API.md) / useAssignedExtensions

# Function: useAssignedExtensions()

> **useAssignedExtensions**(`slotName`, `state?`): [`AssignedExtension`](../interfaces/AssignedExtension.md)[]

Defined in: [packages/framework/esm-react-utils/src/useAssignedExtensions.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAssignedExtensions.ts#L26)

Gets the assigned extensions for a given extension slot name.

The reactive form of `getAssignedExtensions`, and it answers the same thing: display conditions
are always applied, so the result is what should actually be displayed. Pass `state` whenever you
know it: the same slot can be rendered in several places at once with different state, so
conditions are resolved against the state of this rendering. Omitting it resolves them against
the session alone, hiding any extension whose condition depends on state.

The returned array is a copy, so sorting or filtering it in place can't corrupt the extension
store. Its reference is stable for as long as the slot's extensions, the state and the session are.

## Parameters

### slotName

`string`

The name of the slot to get the assigned extensions for.

### state?

[`ExtensionSlotCustomState`](../type-aliases/ExtensionSlotCustomState.md)

The state of this rendering of the slot.

## Returns

[`AssignedExtension`](../interfaces/AssignedExtension.md)[]
