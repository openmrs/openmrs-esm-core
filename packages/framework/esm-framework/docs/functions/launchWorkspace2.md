[O3 Framework](../API.md) / launchWorkspace2

# Function: launchWorkspace2()

> **launchWorkspace2**\<`WorkspaceProps`, `WindowProps`, `GroupProp`\>(`workspaceName`, `workspaceProps`, `windowProps`, `groupProps`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.ts:135](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.ts#L135)

**`Experimental`**

Attempts to launch the specified workspace with the given workspace props. This also implicitly opens
the workspace window to which the workspace belongs (if it's not opened already),
and the workspace group to which the window belongs (if it's not opened already).

When calling `launchWorkspace2`, we need to also pass in the workspace props. While not required,
we can also pass in the window props (shared by other workspaces in the window) and the group props
(shared by all windows and their workspaces). Omitting the window props or the group props[^1] means the caller
explicitly does not care what the current window props and group props are, and that they may be set
by other actions (like calling `launchWorkspace2` on a different workspace with those props passed in)
at a later time.

If there is already an opened workspace group, and it's not the group the workspace belongs to
or has incompatible[^2] group props, then we prompt the user to close the group (and its windows and their workspaces).
On user confirm, the existing opened group is closed and the new workspace, along with its window and its group,
is opened.

If the window is already opened, but with incompatible window props, we prompt the user to close
the window (and all its opened workspaces), and reopen the window with (only) the newly requested workspace.

If the workspace is already opened, but with incompatible workspace props, we also prompt the user to close
the **window** (and all its opened workspaces), and reopen the window with (only) the newly requested workspace.
This is true regardless of whether the already opened workspace has any child workspaces.

Note that calling this function *never* results in creating a child workspace in the affected window.
To do so, we need to call `launchChildWorkspace` instead.

[^1] Omitting window or group props is useful for workspaces that don't have ties to the window or group "context" (props).
For example, in the patient chart, the visit notes / clinical forms / order basket action menu button all share
a "group context" of the current visit. However, the "patient list" action menu button does not need to share that group
context, so opening that workspace should not need to cause other workspaces / windows / groups to potentially close.
The "patient search" workspace in the queues and ward apps is another example.

[^2] 2 sets of props are compatible if either one is nullish, or if they are shallow equal.

## Type Parameters

### WorkspaceProps

`WorkspaceProps` *extends* `object`

### WindowProps

`WindowProps` *extends* `object`

### GroupProp

`GroupProp` *extends* `object`

## Parameters

### workspaceName

`string`

### workspaceProps

`null` | `WorkspaceProps`

### windowProps

`null` | `WindowProps`

### groupProps

`null` | `GroupProp`

## Returns

`Promise`\<`boolean`\>
