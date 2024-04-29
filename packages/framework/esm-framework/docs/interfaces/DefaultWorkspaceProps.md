[@openmrs/esm-framework](../API.md) / DefaultWorkspaceProps

# Interface: DefaultWorkspaceProps

The default parameters received by all workspaces

## Table of contents

### Methods

- [closeWorkspace](DefaultWorkspaceProps.md#closeworkspace)
- [closeWorkspaceWithSavedChanges](DefaultWorkspaceProps.md#closeworkspacewithsavedchanges)
- [handlePostResponse](DefaultWorkspaceProps.md#handlepostresponse)
- [promptBeforeClosing](DefaultWorkspaceProps.md#promptbeforeclosing)

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

[packages/framework/esm-styleguide/src/workspaces/types.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/types.ts#L29)

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

[packages/framework/esm-styleguide/src/workspaces/types.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/types.ts#L39)

___

### handlePostResponse

▸ `Optional` **handlePostResponse**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/types.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/types.ts#L40)

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

[packages/framework/esm-styleguide/src/workspaces/types.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/types.ts#L34)
