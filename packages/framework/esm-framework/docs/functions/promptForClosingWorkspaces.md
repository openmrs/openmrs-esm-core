[O3 Framework](../API.md) / promptForClosingWorkspaces

# Function: promptForClosingWorkspaces()

> **promptForClosingWorkspaces**(`promptReason`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.ts:318](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.ts#L318)

A user can perform actions that explicitly result in closing workspaces
(such that clicking the 'X' button for the workspace or workspace group), or 
implicitly (by opening a workspace with different props than the one that is already opened).
Calls to closeWorkspace2() or closeWorkspaceGroup2() are considered explicit, while calls 
to launchWorkspace2() or launchWorkspaceGroup2() are considered implicit.

This function prompts the user for confirmation to close workspaces with a modal dialog.
When the closing is explicit, it prompts for confirmation for affected workspaces with unsaved changes.
When the closing is implicit, it prompts for confirmation for all affected workspaces, regardless of
whether they have unsaved changes.

## Parameters

### promptReason

`PromptReason`

## Returns

`Promise`\<`boolean`\>

a Promise that resolves to true if the user confirmed closing the workspaces; false otherwise.
