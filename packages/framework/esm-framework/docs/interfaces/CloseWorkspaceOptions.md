[@openmrs/esm-framework](../API.md) / CloseWorkspaceOptions

# Interface: CloseWorkspaceOptions

## Table of contents

### Workspace Properties

- [closeWorkspaceGroup](CloseWorkspaceOptions.md#closeworkspacegroup)
- [ignoreChanges](CloseWorkspaceOptions.md#ignorechanges)

### Workspace Methods

- [onWorkspaceClose](CloseWorkspaceOptions.md#onworkspaceclose)

## Workspace Properties

### closeWorkspaceGroup

• `Optional` **closeWorkspaceGroup**: `boolean`

Controls whether the workspace group should be closed and store to be
cleared when this workspace is closed.
Defaults to true except when opening a new workspace of the same family.

**`default`** true

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L33)

___

### ignoreChanges

• `Optional` **ignoreChanges**: `boolean`

Whether to close the workspace ignoring all the changes present in the workspace.

If ignoreChanges is true, the user will not be prompted to save changes before closing
even if the `testFcn` passed to `promptBeforeClosing` returns `true`.

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L18)

## Workspace Methods

### onWorkspaceClose

▸ `Optional` **onWorkspaceClose**(): `void`

If you want to take an action after the workspace is closed, you can pass your function as
`onWorkspaceClose`. This function will be called only after the workspace is closed, given
that the user might be shown a prompt.

#### Returns

`void`

void

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L25)
