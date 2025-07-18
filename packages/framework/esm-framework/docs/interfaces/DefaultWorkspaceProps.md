[O3 Framework](../API.md) / DefaultWorkspaceProps

# Interface: DefaultWorkspaceProps

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L41)

The default parameters received by all workspaces

## Extended by

- [`OpenWorkspace`](OpenWorkspace.md)

## Methods

### closeWorkspace()

> **closeWorkspace**(`closeWorkspaceOptions?`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L49)

Call this function to close the workspace. This function will prompt the user
if there are any unsaved changes to workspace.

You can pass `onWorkspaceClose` function to be called when the workspace is finally
closed, given the user forcefully closes the workspace.

#### Parameters

##### closeWorkspaceOptions?

[`CloseWorkspaceOptions`](CloseWorkspaceOptions.md)

#### Returns

`void`

***

### closeWorkspaceWithSavedChanges()

> **closeWorkspaceWithSavedChanges**(`closeWorkspaceOptions?`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L59)

Call this function to close the workspace after the form is saved. This function
will directly close the workspace without any prompt

#### Parameters

##### closeWorkspaceOptions?

[`CloseWorkspaceOptions`](CloseWorkspaceOptions.md)

#### Returns

`void`

***

### promptBeforeClosing()

> **promptBeforeClosing**(`testFcn`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L54)

Call this with a no-args function that returns true if the user should be prompted before
this workspace is closed; e.g. if there is unsaved data.

#### Parameters

##### testFcn

() => `boolean`

#### Returns

`void`

***

### setTitle()

> **setTitle**(`title`, `titleNode?`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L74)

Use this to set the workspace title if it needs to be set dynamically.

Workspace titles generally are set in the workspace declaration in the routes.json file. They can also
be set by the workspace launcher by passing `workspaceTitle` in the `additionalProps`
parameter of the `launchWorkspace` function. This function is useful when the workspace
title needs to be set dynamically.

#### Parameters

##### title

`string`

The title to set. If using titleNode, set this to a human-readable string
       which will identify the workspace in notifications and other places.

##### titleNode?

`ReactNode`

A React object to put in the workspace header in place of the title. This
       is useful for displaying custom elements in the header. Note that custom header
       elements can also be attached to the workspace header extension slots.

#### Returns

`void`
