[O3 Framework](../API.md) / ExportedWorkspaceProps

# Interface: ExportedWorkspaceProps

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L27)

## Properties

### groupProps?

> `optional` **groupProps**: `Record`\<`string`, `any`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L41)

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L33)

The name of the workspace to open. Changing it (like changing `workspaceProps`, `windowProps` or
`groupProps`) discards the current workspaces, without prompting for unsaved changes, and opens
`name` afresh. To force a fresh instance without changing any of these, change the React `key`.

***

### windowProps?

> `optional` **windowProps**: `Record`\<`string`, `any`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L40)

***

### workspaceProps

> **workspaceProps**: `Record`\<`string`, `any`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L39)

The props passed into the workspace. Changing these (compared shallowly), or `windowProps` /
`groupProps`, discards the current workspaces and opens `name` afresh with the new props.

## Methods

### onWindowChanged()?

> `optional` **onWindowChanged**(`info`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L44)

Callback fired when the emulated window's state changes.

#### Parameters

##### info

[`ExportedWorkspaceWindowInfo`](ExportedWorkspaceWindowInfo.md)

#### Returns

`void`
