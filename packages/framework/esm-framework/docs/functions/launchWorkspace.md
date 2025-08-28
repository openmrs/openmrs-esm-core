[O3 Framework](../API.md) / launchWorkspace

# Function: launchWorkspace()

> **launchWorkspace**\<`T`\>(`name`, `additionalProps?`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:296](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L296)

This launches a workspace by its name. The workspace must have been registered.
Workspaces should be registered in the `routes.json` file.

For the workspace to appear, there must be either a `<WorkspaceOverlay />` or
a `<WorkspaceWindow />` component rendered.

The behavior of this function is as follows:

- If no workspaces are open, or if no other workspaces with the same type are open,
  it will be opened and focused.
- If a workspace with the same name is already open, it will be displayed/focused,
  if it was not already.
- If a workspace is launched and a workspace which cannot be hidden is already open,
 a confirmation modal will pop up warning about closing the currently open workspace.
- If another workspace with the same type is open, the workspace will be brought to
  the front and then a confirmation modal will pop up warning about closing the opened
  workspace

Note that this function just manipulates the workspace store. The UI logic is handled
by the components that display workspaces.

Additional props can be passed to the workspace component being launched. Passing a
prop named `workspaceTitle` will override the title of the workspace.

## Type Parameters

### T

`T` *extends* `object` \| [`DefaultWorkspaceProps`](../interfaces/DefaultWorkspaceProps.md) = [`DefaultWorkspaceProps`](../interfaces/DefaultWorkspaceProps.md) & `object`

## Parameters

### name

`string`

The name of the workspace to launch

### additionalProps?

`Omit`\<`T`, keyof [`DefaultWorkspaceProps`](../interfaces/DefaultWorkspaceProps.md)\> & `object`

Props to pass to the workspace component being launched. Passing
         a prop named `workspaceTitle` will override the title of the workspace.

## Returns

`void`
