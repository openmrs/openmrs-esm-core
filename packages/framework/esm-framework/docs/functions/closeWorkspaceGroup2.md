[O3 Framework](../API.md) / closeWorkspaceGroup2

# Function: closeWorkspaceGroup2()

> **closeWorkspaceGroup2**(): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.ts:68](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.ts#L68)

**`Experimental`**

Closes the workspace group that is currently opened. Note that only one workspace group
may be opened at any given time

## Returns

`Promise`\<`boolean`\>

a Promise that resolves to true if there is no opened group to begin with or we successfully closed
the opened group; false otherwise.
