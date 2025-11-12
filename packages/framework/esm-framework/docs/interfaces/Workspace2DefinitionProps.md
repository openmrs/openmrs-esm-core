[O3 Framework](../API.md) / Workspace2DefinitionProps

# Interface: Workspace2DefinitionProps\<WorkspaceProps, WindowProps, GroupProps\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L20)

**`Experimental`**

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

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L44)

**`Experimental`**

***

### isRootWorkspace

> **isRootWorkspace**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:47](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L47)

**`Experimental`**

***

### windowName

> **windowName**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:46](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L46)

**`Experimental`**

***

### windowProps

> **windowProps**: `null` \| `WindowProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L43)

**`Experimental`**

***

### workspaceName

> **workspaceName**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L45)

**`Experimental`**

***

### workspaceProps

> **workspaceProps**: `null` \| `WorkspaceProps`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L42)

**`Experimental`**

## Methods

### closeWorkspace()

> **closeWorkspace**(`options?`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L40)

**`Experimental`**

closes the current workspace, along with its children.

#### Parameters

##### options?

###### closeWindow?

`boolean`

###### discardUnsavedChanges?

`boolean`

#### Returns

`Promise`\<`boolean`\>

a Promise that resolves to true if the workspace is closed, false otherwise.

***

### launchChildWorkspace()

> **launchChildWorkspace**\<`Props`\>(`workspaceName`, `workspaceProps?`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.component.tsx#L32)

**`Experimental`**

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

`void`
