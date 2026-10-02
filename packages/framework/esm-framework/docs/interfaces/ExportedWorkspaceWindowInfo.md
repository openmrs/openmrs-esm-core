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

### windowWidth

> **windowWidth**: [`WorkspaceWindow2Width`](../type-aliases/WorkspaceWindow2Width.md)

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L20)

The emulated workspace window's configured width. Note that this is a static property of the
emulated workspace window, and does not change for the duration of the app.

***

### workspaceName

> **workspaceName**: `null` \| `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L15)

The name of the currently-rendered (leaf) workspace, or `null` when all workspaces are closed.
