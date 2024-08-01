[@openmrs/esm-framework](../API.md) / OpenWorkspace

# Interface: OpenWorkspace

## Hierarchy

- [`WorkspaceRegistration`](WorkspaceRegistration.md)

- [`DefaultWorkspaceProps`](DefaultWorkspaceProps.md)

  ↳ **`OpenWorkspace`**

## Table of contents

### Other Properties

- [canHide](OpenWorkspace.md#canhide)
- [canMaximize](OpenWorkspace.md#canmaximize)
- [hasOwnSidebar](OpenWorkspace.md#hasownsidebar)
- [moduleName](OpenWorkspace.md#modulename)
- [name](OpenWorkspace.md#name)
- [preferredWindowSize](OpenWorkspace.md#preferredwindowsize)
- [sidebarFamily](OpenWorkspace.md#sidebarfamily)
- [title](OpenWorkspace.md#title)
- [titleNode](OpenWorkspace.md#titlenode)
- [type](OpenWorkspace.md#type)
- [width](OpenWorkspace.md#width)

### Workspace Properties

- [additionalProps](OpenWorkspace.md#additionalprops)

### Methods

- [closeWorkspace](OpenWorkspace.md#closeworkspace)
- [closeWorkspaceWithSavedChanges](OpenWorkspace.md#closeworkspacewithsavedchanges)
- [load](OpenWorkspace.md#load)
- [promptBeforeClosing](OpenWorkspace.md#promptbeforeclosing)
- [setTitle](OpenWorkspace.md#settitle)

## Other Properties

### canHide

• **canHide**: `boolean`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[canHide](WorkspaceRegistration.md#canhide)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L14)

___

### canMaximize

• **canMaximize**: `boolean`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[canMaximize](WorkspaceRegistration.md#canmaximize)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L15)

___

### hasOwnSidebar

• **hasOwnSidebar**: `boolean`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[hasOwnSidebar](WorkspaceRegistration.md#hasownsidebar)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L17)

___

### moduleName

• **moduleName**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[moduleName](WorkspaceRegistration.md#modulename)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L21)

___

### name

• **name**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[name](WorkspaceRegistration.md#name)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L10)

___

### preferredWindowSize

• **preferredWindowSize**: [`WorkspaceWindowState`](../API.md#workspacewindowstate)

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[preferredWindowSize](WorkspaceRegistration.md#preferredwindowsize)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L19)

___

### sidebarFamily

• **sidebarFamily**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[sidebarFamily](WorkspaceRegistration.md#sidebarfamily)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L18)

___

### title

• **title**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[title](WorkspaceRegistration.md#title)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L11)

___

### titleNode

• `Optional` **titleNode**: `ReactNode`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[titleNode](WorkspaceRegistration.md#titlenode)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L12)

___

### type

• **type**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[type](WorkspaceRegistration.md#type)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L13)

___

### width

• **width**: ``"narrow"`` \| ``"wider"`` \| ``"extra-wide"``

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[width](WorkspaceRegistration.md#width)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L16)

___

## Workspace Properties

### additionalProps

• **additionalProps**: `object`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:107](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L107)

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

#### Inherited from

[DefaultWorkspaceProps](DefaultWorkspaceProps.md).[closeWorkspace](DefaultWorkspaceProps.md#closeworkspace)

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

#### Inherited from

[DefaultWorkspaceProps](DefaultWorkspaceProps.md).[closeWorkspaceWithSavedChanges](DefaultWorkspaceProps.md#closeworkspacewithsavedchanges)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L57)

___

### load

▸ **load**(): `Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Returns

`Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[load](WorkspaceRegistration.md#load)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L20)

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

#### Inherited from

[DefaultWorkspaceProps](DefaultWorkspaceProps.md).[promptBeforeClosing](DefaultWorkspaceProps.md#promptbeforeclosing)

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

#### Inherited from

[DefaultWorkspaceProps](DefaultWorkspaceProps.md).[setTitle](DefaultWorkspaceProps.md#settitle)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L72)
