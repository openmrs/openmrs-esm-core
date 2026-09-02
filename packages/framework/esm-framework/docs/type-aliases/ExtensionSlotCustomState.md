[O3 Framework](../API.md) / ExtensionSlotCustomState

# Type Alias: ExtensionSlotCustomState

> **ExtensionSlotCustomState** = `Record`\<`string`, `unknown`\> \| `undefined`

Defined in: [packages/framework/esm-extensions/src/store.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L80)

The state one rendering of a slot is displaying, which its extensions' display conditions are
evaluated against. Each key becomes a variable of that name in the expression, so only string
keys are reachable from a condition.
