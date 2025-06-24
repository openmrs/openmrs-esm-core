[@openmrs/esm-framework](../API.md) / OpenWorkspace

# Interface: OpenWorkspace

## Hierarchy

- `WorkspaceRegistration`

- [`DefaultWorkspaceProps`](DefaultWorkspaceProps.md)

  ↳ **`OpenWorkspace`**

## Table of contents

### Other Properties

- [canHide](OpenWorkspace.md#canhide)
- [canMaximize](OpenWorkspace.md#canmaximize)
- [groups](OpenWorkspace.md#groups)
- [moduleName](OpenWorkspace.md#modulename)
- [name](OpenWorkspace.md#name)
- [preferredWindowSize](OpenWorkspace.md#preferredwindowsize)
- [title](OpenWorkspace.md#title)
- [titleNode](OpenWorkspace.md#titlenode)
- [type](OpenWorkspace.md#type)
- [width](OpenWorkspace.md#width)

### Workspace Properties

- [additionalProps](OpenWorkspace.md#additionalprops)
- [currentWorkspaceGroup](OpenWorkspace.md#currentworkspacegroup)

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

WorkspaceRegistration.canHide

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:10

___

### canMaximize

• **canMaximize**: `boolean`

#### Inherited from

WorkspaceRegistration.canMaximize

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:11

___

### groups

• **groups**: `string`[]

#### Inherited from

WorkspaceRegistration.groups

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:18

___

### moduleName

• **moduleName**: `string`

#### Inherited from

WorkspaceRegistration.moduleName

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:17

___

### name

• **name**: `string`

#### Inherited from

WorkspaceRegistration.name

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:6

___

### preferredWindowSize

• **preferredWindowSize**: [`WorkspaceWindowState`](../API.md#workspacewindowstate)

#### Inherited from

WorkspaceRegistration.preferredWindowSize

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:13

___

### title

• **title**: `string`

#### Inherited from

WorkspaceRegistration.title

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:7

___

### titleNode

• `Optional` **titleNode**: `ReactNode`

#### Inherited from

WorkspaceRegistration.titleNode

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:8

___

### type

• **type**: `string`

#### Inherited from

WorkspaceRegistration.type

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:9

___

### width

• **width**: ``"narrow"`` \| ``"wider"`` \| ``"extra-wide"``

#### Inherited from

WorkspaceRegistration.width

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:12

___

## Workspace Properties

### additionalProps

• **additionalProps**: `object`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:114](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L114)

___

### currentWorkspaceGroup

• `Optional` **currentWorkspaceGroup**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:115](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L115)

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

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L49)

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

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L59)

___

### load

▸ **load**(): `Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Returns

`Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Inherited from

WorkspaceRegistration.load

#### Defined in

packages/framework/esm-extensions/dist/workspaces.d.ts:14

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

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L54)

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

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L74)
