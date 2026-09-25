[O3 Framework](../API.md) / ExportedWorkspaceWindowInfo

# Interface: ExportedWorkspaceWindowInfo

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L13)

## Properties

### hasUnsavedChanges

> **hasUnsavedChanges**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L24)

The `hasUnsavedChanges` of every workspace in the window, OR'd together.

***

### title

> **title**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L22)

The title of the currently-rendered (leaf) workspace, or `''` when all workspaces are closed.

***

### windowSize

> **windowSize**: [`WorkspaceWindowState`](../type-aliases/WorkspaceWindowState.md)

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L20)

The emulated window size. Has no effect on rendering. `<ExportedWorkspace>` renders no
maximize / hide buttons, so this is currently always `'normal'`.

***

### workspaceName

> **workspaceName**: `null` \| `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L15)

The name of the currently-rendered (leaf) workspace, or `null` when all workspaces are closed.
