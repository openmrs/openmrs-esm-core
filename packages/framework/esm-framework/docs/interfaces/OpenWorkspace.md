[O3 Framework](../API.md) / OpenWorkspace

# Interface: OpenWorkspace

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:113](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L113)

See [[WorkspaceDefinition]] for more information about these properties

## Extends

- [`WorkspaceRegistration`](WorkspaceRegistration.md).[`DefaultWorkspaceProps`](DefaultWorkspaceProps.md)

## Properties

### additionalProps

> **additionalProps**: `object`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:114](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L114)

***

### canHide

> **canHide**: `boolean`

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:14](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L14)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`canHide`](WorkspaceRegistration.md#canhide)

***

### canMaximize

> **canMaximize**: `boolean`

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:15](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L15)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`canMaximize`](WorkspaceRegistration.md#canmaximize)

***

### currentWorkspaceGroup?

> `optional` **currentWorkspaceGroup**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:115](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L115)

***

### groups

> **groups**: `string`[]

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:20](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L20)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`groups`](WorkspaceRegistration.md#groups)

***

### moduleName

> **moduleName**: `string`

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:19](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L19)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`moduleName`](WorkspaceRegistration.md#modulename)

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:10](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L10)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`name`](WorkspaceRegistration.md#name)

***

### preferredWindowSize

> **preferredWindowSize**: [`WorkspaceWindowState`](../type-aliases/WorkspaceWindowState.md)

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:17](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L17)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`preferredWindowSize`](WorkspaceRegistration.md#preferredwindowsize)

***

### title

> **title**: `string`

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:11](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L11)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`title`](WorkspaceRegistration.md#title)

***

### titleNode?

> `optional` **titleNode**: `ReactNode`

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:12](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L12)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`titleNode`](WorkspaceRegistration.md#titlenode)

***

### type

> **type**: `string`

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:13](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L13)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`type`](WorkspaceRegistration.md#type)

***

### width

> **width**: `"narrow"` \| `"wider"` \| `"extra-wide"`

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:16](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L16)

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`width`](WorkspaceRegistration.md#width)

## Methods

### closeWorkspace()

> **closeWorkspace**(`closeWorkspaceOptions?`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:49](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L49)

Call this function to close the workspace. This function will prompt the user
if there are any unsaved changes to workspace.

You can pass `onWorkspaceClose` function to be called when the workspace is finally
closed, given the user forcefully closes the workspace.

#### Parameters

##### closeWorkspaceOptions?

[`CloseWorkspaceOptions`](CloseWorkspaceOptions.md)

#### Returns

`void`

#### Inherited from

[`DefaultWorkspaceProps`](DefaultWorkspaceProps.md).[`closeWorkspace`](DefaultWorkspaceProps.md#closeworkspace)

***

### closeWorkspaceWithSavedChanges()

> **closeWorkspaceWithSavedChanges**(`closeWorkspaceOptions?`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:59](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L59)

Call this function to close the workspace after the form is saved. This function
will directly close the workspace without any prompt

#### Parameters

##### closeWorkspaceOptions?

[`CloseWorkspaceOptions`](CloseWorkspaceOptions.md)

#### Returns

`void`

#### Inherited from

[`DefaultWorkspaceProps`](DefaultWorkspaceProps.md).[`closeWorkspaceWithSavedChanges`](DefaultWorkspaceProps.md#closeworkspacewithsavedchanges)

***

### load()

> **load**(): `Promise`\<`LifeCycles`\>

Defined in: [packages/framework/esm-extensions/src/workspaces.ts:18](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L18)

#### Returns

`Promise`\<`LifeCycles`\>

#### Inherited from

[`WorkspaceRegistration`](WorkspaceRegistration.md).[`load`](WorkspaceRegistration.md#load)

***

### promptBeforeClosing()

> **promptBeforeClosing**(`testFcn`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:54](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L54)

Call this with a no-args function that returns true if the user should be prompted before
this workspace is closed; e.g. if there is unsaved data.

#### Parameters

##### testFcn

() => `boolean`

#### Returns

`void`

#### Inherited from

[`DefaultWorkspaceProps`](DefaultWorkspaceProps.md).[`promptBeforeClosing`](DefaultWorkspaceProps.md#promptbeforeclosing)

***

### setTitle()

> **setTitle**(`title`, `titleNode?`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:74](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L74)

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

#### Inherited from

[`DefaultWorkspaceProps`](DefaultWorkspaceProps.md).[`setTitle`](DefaultWorkspaceProps.md#settitle)
