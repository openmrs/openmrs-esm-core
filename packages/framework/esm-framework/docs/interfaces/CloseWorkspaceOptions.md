[@openmrs/esm-framework](../API.md) / CloseWorkspaceOptions

# Interface: CloseWorkspaceOptions

## Table of contents

### Workspace Properties

- [ignoreChanges](CloseWorkspaceOptions.md#ignorechanges)

### Workspace Methods

- [onWorkspaceClose](CloseWorkspaceOptions.md#onworkspaceclose)

## Workspace Properties

### ignoreChanges

• `Optional` **ignoreChanges**: `boolean`

Whether to close the workspace ignoring all the changes present in the workspace.

If ignoreChanges is true, the user will not be prompted to save changes before closing
even if the `testFcn` passed to `promptBeforeClosing` returns `true`.

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L19)

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

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L26)
