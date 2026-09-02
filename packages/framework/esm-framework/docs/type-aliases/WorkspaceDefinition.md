[O3 Framework](../API.md) / WorkspaceDefinition

# Type Alias: WorkspaceDefinition

> **WorkspaceDefinition** = `object`

Defined in: [packages/framework/esm-globals/src/types.ts:237](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L237)

A definition of a workspace as extracted from an app's routes.json

## Properties

### canHide?

> `optional` **canHide**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:253](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L253)

***

### canMaximize?

> `optional` **canMaximize**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:254](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L254)

***

### component

> **component**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:290](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L290)

The name of the component exported by this frontend module.

***

### groups

> **groups**: `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:286](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L286)

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

Defined in: [packages/framework/esm-globals/src/types.ts:241](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L241)

The name of this workspace. This is used to launch the workspace.

***

### preferredWindowSize?

> `optional` **preferredWindowSize**: [`WorkspaceWindowState`](WorkspaceWindowState.md)

Defined in: [packages/framework/esm-globals/src/types.ts:264](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L264)

Launches the workspace in the preferred size, it defaults to the 'narrow' width

***

### title

> **title**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:246](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L246)

The title of the workspace. This will be looked up as a key in the translations of the module
defining the workspace.

***

### type

> **type**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:252](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L252)

The type of the workspace. Only one of each "type" of workspace is allowed to be open at a
time. The default is "form". If the right sidebar is in use, then the type determines which
right sidebar icon corresponds to the workspace.

***

### width?

> `optional` **width**: `"narrow"` \| `"wider"` \| `"extra-wide"`

Defined in: [packages/framework/esm-globals/src/types.ts:260](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L260)

Controls the width of the workspace. The default is "narrow" and this should only be
changed to "wider" if the workspace itself has internal navigation, like the form editor.
The width "extra-wide" is for workspaces that contain their own sidebar.
