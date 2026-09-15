[O3 Framework](../API.md) / getAssignedExtensions

# Function: getAssignedExtensions()

> **getAssignedExtensions**(`slotName`, `state?`): [`AssignedExtension`](../interfaces/AssignedExtension.md)[]

Defined in: [packages/framework/esm-extensions/src/extensions.ts:554](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/extensions.ts#L554)

Gets the extensions a given rendering of a slot should display, in order. This is the supported
way to ask what belongs in a slot; reading the extension store directly skips display conditions.

Display conditions are evaluated against `state`, so pass whatever the slot is being rendered
for. The same slot can be rendered many times with different state — once per row of a table,
say — and each rendering can resolve to a different set of extensions. Omitting `state` hides
every extension whose condition refers to it, since the condition cannot be evaluated.

## Parameters

### slotName

`string`

The slot to load the extensions for

### state?

[`ExtensionSlotCustomState`](../type-aliases/ExtensionSlotCustomState.md)

The state of the rendering of the slot the extensions will be displayed in

## Returns

[`AssignedExtension`](../interfaces/AssignedExtension.md)[]

Those extensions assigned to the slot whose display conditions hold
