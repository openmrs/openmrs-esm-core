[O3 Framework](../API.md) / WorkspaceDefinition

# Type Alias: WorkspaceDefinition

> **WorkspaceDefinition** = `object` & \{ `component`: `string`; \} \| \{ `component?`: `never`; \}

Defined in: packages/framework/esm-globals/dist/types.d.ts:264

A definition of a workspace as extracted from an app's routes.json

## Type declaration

### canHide?

> `optional` **canHide**: `boolean`

### canMaximize?

> `optional` **canMaximize**: `boolean`

### groups

> **groups**: `string`[]

Workspaces can open either independently or as part of a "workspace group". A
"workspace group" groups related workspaces together, so that only one is visible
at a time. For example,

#### Example

```ts
{
     *  name: 'order-basket',
     *  type: 'order',
     *  groups: ['ward-patient']
     * }

This means that the 'order-basket' workspace can be opened independently, or only
in the 'ward-patient'.
If a workspace group is already open and a new workspace is launched, and the
groups in the newly launched workspace do not include the currently open group’s
name, the entire workspace group will close, and the new workspace will launch independently.
```

### name

> **name**: `string`

The name of this workspace. This is used to launch the workspace.

### preferredWindowSize?

> `optional` **preferredWindowSize**: [`WorkspaceWindowState`](WorkspaceWindowState.md)

Launches the workspace in the preferred size, it defaults to the 'narrow' width

### title

> **title**: `string`

The title of the workspace. This will be looked up as a key in the translations of the module
defining the workspace.

### type

> **type**: `string`

The type of the workspace. Only one of each "type" of workspace is allowed to be open at a
time. The default is "form". If the right sidebar is in use, then the type determines which
right sidebar icon corresponds to the workspace.

### width?

> `optional` **width**: `"narrow"` \| `"wider"` \| `"extra-wide"`

Controls the width of the workspace. The default is "narrow" and this should only be
changed to "wider" if the workspace itself has internal navigation, like the form editor.
The width "extra-wide" is for workspaces that contain their own sidebar.
