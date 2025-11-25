[O3 Framework](../API.md) / closeWorkspaceGroup2

# Function: closeWorkspaceGroup2()

> **closeWorkspaceGroup2**(`discardUnsavedChanges?`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.ts#L75)

**`Experimental`**

Closes the workspace group that is currently opened. Note that only one workspace group
may be opened at any given time

## Parameters

### discardUnsavedChanges?

`boolean`

If true, then the workspace group is forced closed, with no prompt
for confirmation for unsaved changes in any opened workspace. This should be used sparingly
for clean-up purpose, ex: when exiting an app.

## Returns

`Promise`\<`boolean`\>

a Promise that resolves to true if there is no opened group to begin with or we successfully closed
the opened group; false otherwise.
