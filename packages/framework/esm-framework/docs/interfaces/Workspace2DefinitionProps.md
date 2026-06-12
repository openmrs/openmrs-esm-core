[O3 Framework](../API.md) / Workspace2DefinitionProps

# Interface: Workspace2DefinitionProps\<WorkspaceProps, WindowProps, GroupProps\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L18)

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

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L43)

***

### isRootWorkspace

> **isRootWorkspace**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:46](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L46)

***

### showActionMenu

> **showActionMenu**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:47](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L47)

***

### windowName

> **windowName**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L45)

***

### windowProps

> **windowProps**: `null` \| `WindowProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L42)

***

### workspaceName

> **workspaceName**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L44)

***

### workspaceProps

> **workspaceProps**: `null` \| `WorkspaceProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L41)

## Methods

### closeWorkspace()

> **closeWorkspace**(`options?`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L39)

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

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L30)

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
