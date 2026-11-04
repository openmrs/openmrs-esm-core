[O3 Framework](../API.md) / ExportedWorkspaceWindowInfo

# Interface: ExportedWorkspaceWindowInfo

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L12)

## Properties

### hasUnsavedChanges

> **hasUnsavedChanges**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L23)

The `hasUnsavedChanges` of every workspace in the window, OR'd together.

***

### title

> **title**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L21)

The title of the currently-rendered (leaf) workspace, or `''` when all workspaces are closed.

***

### windowWidth

> **windowWidth**: [`WorkspaceWindow2Width`](../type-aliases/WorkspaceWindow2Width.md)

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L19)

The emulated workspace window's configured width. Note that this is a static property of the
emulated workspace window, and only changes when the workspace / window is changed.

***

### workspaceName

> **workspaceName**: `null` \| `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L14)

The name of the currently-rendered (leaf) workspace, or `null` when all workspaces are closed.
