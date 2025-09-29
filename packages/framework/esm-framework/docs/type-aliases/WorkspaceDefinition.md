[O3 Framework](../API.md) / WorkspaceDefinition

# Type Alias: WorkspaceDefinition

> **WorkspaceDefinition** = `object`

Defined in: packages/framework/esm-globals/dist/types.d.ts:233

A definition of a workspace as extracted from an app's routes.json

## Properties

### canHide?

> `optional` **canHide**: `boolean`

Defined in: packages/framework/esm-globals/dist/types.d.ts:249

***

### canMaximize?

> `optional` **canMaximize**: `boolean`

Defined in: packages/framework/esm-globals/dist/types.d.ts:250

***

### component

> **component**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:285

The name of the component exported by this frontend module.

***

### groups

> **groups**: `string`[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:281

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

***

### name

> **name**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:237

The name of this workspace. This is used to launch the workspace.

***

### preferredWindowSize?

> `optional` **preferredWindowSize**: [`WorkspaceWindowState`](WorkspaceWindowState.md)

Defined in: packages/framework/esm-globals/dist/types.d.ts:260

Launches the workspace in the preferred size, it defaults to the 'narrow' width

***

### title

> **title**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:242

The title of the workspace. This will be looked up as a key in the translations of the module
defining the workspace.

***

### type

> **type**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:248

The type of the workspace. Only one of each "type" of workspace is allowed to be open at a
time. The default is "form". If the right sidebar is in use, then the type determines which
right sidebar icon corresponds to the workspace.

***

### width?

> `optional` **width**: `"narrow"` \| `"wider"` \| `"extra-wide"`

Defined in: packages/framework/esm-globals/dist/types.d.ts:256

Controls the width of the workspace. The default is "narrow" and this should only be
changed to "wider" if the workspace itself has internal navigation, like the form editor.
The width "extra-wide" is for workspaces that contain their own sidebar.
