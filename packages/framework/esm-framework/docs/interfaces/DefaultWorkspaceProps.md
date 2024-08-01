[@openmrs/esm-framework](../API.md) / DefaultWorkspaceProps

# Interface: DefaultWorkspaceProps

The default parameters received by all workspaces

## Hierarchy

- **`DefaultWorkspaceProps`**

  ↳ [`OpenWorkspace`](OpenWorkspace.md)

## Table of contents

### Methods

- [closeWorkspace](DefaultWorkspaceProps.md#closeworkspace)
- [closeWorkspaceWithSavedChanges](DefaultWorkspaceProps.md#closeworkspacewithsavedchanges)
- [promptBeforeClosing](DefaultWorkspaceProps.md#promptbeforeclosing)
- [setTitle](DefaultWorkspaceProps.md#settitle)

## Methods

### closeWorkspace

▸ **closeWorkspace**(`closeWorkspaceOptions?`): `void`

Call this function to close the workspace. This function will prompt the user
if there are any unsaved changes to workspace.

You can pass `onWorkspaceClose` function to be called when the workspace is finally
closed, given the user forcefully closes the workspace.

#### Parameters

| Name | Type |
| :------ | :------ |
| `closeWorkspaceOptions?` | [`CloseWorkspaceOptions`](CloseWorkspaceOptions.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:47](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L47)

___

### closeWorkspaceWithSavedChanges

▸ **closeWorkspaceWithSavedChanges**(`closeWorkspaceOptions?`): `void`

Call this function to close the workspace after the form is saved. This function
will directly close the workspace without any prompt

#### Parameters

| Name | Type |
| :------ | :------ |
| `closeWorkspaceOptions?` | [`CloseWorkspaceOptions`](CloseWorkspaceOptions.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L57)

___

### promptBeforeClosing

▸ **promptBeforeClosing**(`testFcn`): `void`

Call this with a no-args function that returns true if the user should be prompted before
this workspace is closed; e.g. if there is unsaved data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `testFcn` | () => `boolean` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L52)

___

### setTitle

▸ **setTitle**(`title`, `titleNode?`): `void`

Use this to set the workspace title if it needs to be set dynamically.

Workspace titles generally are set in the workspace declaration in the routes.json file. They can also
be set by the workspace launcher by passing `workspaceTitle` in the `additionalProps`
parameter of the `launchWorkspace` function. This function is useful when the workspace
title needs to be set dynamically.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `title` | `string` | The title to set. If using titleNode, set this to a human-readable string        which will identify the workspace in notifications and other places. |
| `titleNode?` | `ReactNode` | A React object to put in the workspace header in place of the title. This        is useful for displaying custom elements in the header. Note that custom header        elements can also be attached to the workspace header extension slots. |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L72)
