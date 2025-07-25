[O3 Framework](../API.md) / Workspace2DefinitionProps

# Interface: Workspace2DefinitionProps\<WorkspaceProps, WindowProps, GroupProps\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L18)

## Type Parameters

### WorkspaceProps

`WorkspaceProps` *extends* `Record`\<`string`, `any`\> = `object`

### WindowProps

`WindowProps` *extends* `Record`\<`string`, `any`\> = `object`

### GroupProps

`GroupProps` *extends* `Record`\<`string`, `any`\> = `object`

## Properties

### groupProps

> **groupProps**: `null` \| `GroupProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L43)

***

### windowProps

> **windowProps**: `null` \| `WindowProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L42)

***

### workspaceName

> **workspaceName**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L23)

***

### workspaceProps

> **workspaceProps**: `null` \| `WorkspaceProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L41)

## Methods

### closeWorkspace()

> **closeWorkspace**(`closeWindow?`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L39)

closes the current workspace, along with its children.

#### Parameters

##### closeWindow?

`boolean`

If true, the workspace's window, along with all workspaces within it, will be closed as well

#### Returns

`Promise`\<`boolean`\>

a Promise that resolves to true if the workspace is closed, false otherwise.

***

### launchChildWorkspace()

> **launchChildWorkspace**\<`Props`\>(`workspaceName`, `workspaceProps`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L32)

This function launches a child workspace. Unlike `launchWorkspace()`, this function is meant
to be called from the a workspace, and it does not allow passing it (or changing)
the window props or group props

#### Type Parameters

##### Props

`Props` *extends* `Record`\<`string`, `any`\>

#### Parameters

##### workspaceName

`string`

##### workspaceProps

`Props`

#### Returns

`void`
