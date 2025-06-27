[O3 Framework](../API.md) / CloseWorkspaceOptions

# Interface: CloseWorkspaceOptions

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L15)

## Properties

### closeWorkspaceGroup?

> `optional` **closeWorkspaceGroup**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L37)

Controls whether the workspace group should be closed and store to be
cleared when this workspace is closed.
Defaults to true except when opening a new workspace of the same group.

#### Default

```ts
true
```

***

### ignoreChanges?

> `optional` **ignoreChanges**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L22)

Whether to close the workspace ignoring all the changes present in the workspace.

If ignoreChanges is true, the user will not be prompted to save changes before closing
even if the `testFcn` passed to `promptBeforeClosing` returns `true`.

***

### onWorkspaceClose()?

> `optional` **onWorkspaceClose**: () => `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L29)

If you want to take an action after the workspace is closed, you can pass your function as
`onWorkspaceClose`. This function will be called only after the workspace is closed, given
that the user might be shown a prompt.

#### Returns

`void`

void
