[O3 Framework](../API.md) / Workspace2DefinitionProps

# Interface: Workspace2DefinitionProps\<WorkspaceProps, WindowProps, GroupProps\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L10)

## Type Parameters

### WorkspaceProps

`WorkspaceProps` *extends* `object` = `object`

### WindowProps

`WindowProps` *extends* `object` = `object`

### GroupProps

`GroupProps` *extends* `object` = `object`

## Properties

### groupProps

> **groupProps**: `null` \| `GroupProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L35)

***

### isRootWorkspace

> **isRootWorkspace**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L43)

***

### showActionMenu

> **showActionMenu**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L44)

***

### windowName

> **windowName**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L42)

***

### windowProps

> **windowProps**: `null` \| `WindowProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L34)

***

### workspaceMeta?

> `optional` **workspaceMeta**: `Readonly`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L40)

The workspace's `meta` from its registration (the `meta` field of its `workspaces2` entry in
`routes.json`).

***

### workspaceName

> **workspaceName**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L41)

***

### workspaceProps

> **workspaceProps**: `null` \| `WorkspaceProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L33)

## Methods

### closeWorkspace()

> **closeWorkspace**(`options?`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L31)

closes the current workspace, along with its children.

#### Parameters

##### options?

Optional configuration for closing the workspace.

###### closeWindow?

`boolean`

If true, the workspace's window, along with all workspaces within it, will be closed as well.

###### discardUnsavedChanges?

`boolean`

If true, the "unsaved changes" modal will be suppressed, and the value of `hasUnsavedChanges` will be ignored. Use this when closing the workspace immediately after changes are saved.

#### Returns

`Promise`\<`boolean`\>

a Promise that resolves to true if the workspace is closed, false otherwise.

***

### launchChildWorkspace()

> **launchChildWorkspace**\<`Props`\>(`workspaceName`, `workspaceProps?`): `Promise`\<`void`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L22)

This function launches a child workspace. Unlike `launchWorkspace()`, this function is meant
to be called from the a workspace, and it does not allow passing (or changing)
the window props or group props

#### Type Parameters

##### Props

`Props` *extends* `object`

#### Parameters

##### workspaceName

`string`

##### workspaceProps?

`Props`

#### Returns

`Promise`\<`void`\>
