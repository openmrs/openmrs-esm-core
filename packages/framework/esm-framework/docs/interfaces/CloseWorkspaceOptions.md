[@openmrs/esm-framework](../API.md) / CloseWorkspaceOptions

# Interface: CloseWorkspaceOptions

## Table of contents

### Properties

- [ignoreChanges](CloseWorkspaceOptions.md#ignorechanges)

### Methods

- [onWorkspaceClose](CloseWorkspaceOptions.md#onworkspaceclose)

## Properties

### ignoreChanges

• `Optional` **ignoreChanges**: `boolean`

Whether to close the workspace ignoring all the changes present in the workspace.

If ignoreChanges is true, the user will not be prompted to save changes before closing
even if the `testFcn` passed to `promptBeforeClosing` returns `true`.

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/types.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/types.ts#L11)

## Methods

### onWorkspaceClose

▸ `Optional` **onWorkspaceClose**(): `void`

If you want to take an action after the workspace is closed, you can pass your function as
`onWorkspaceClose`. This function will be called only after the workspace is closed, given
that the user might be shown a prompt.

#### Returns

`void`

void

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/types.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/types.ts#L18)
