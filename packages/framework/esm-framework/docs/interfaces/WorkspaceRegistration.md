[@openmrs/esm-framework](../API.md) / WorkspaceRegistration

# Interface: WorkspaceRegistration

See [WorkspaceDefinition](../API.md#workspacedefinition) for more information about these properties

## Hierarchy

- **`WorkspaceRegistration`**

  ↳ [`OpenWorkspace`](OpenWorkspace.md)

## Table of contents

### Properties

- [canHide](WorkspaceRegistration.md#canhide)
- [canMaximize](WorkspaceRegistration.md#canmaximize)
- [cancelConfirmText](WorkspaceRegistration.md#cancelconfirmtext)
- [cancelMessage](WorkspaceRegistration.md#cancelmessage)
- [cancelTitle](WorkspaceRegistration.md#canceltitle)
- [hasOwnSidebar](WorkspaceRegistration.md#hasownsidebar)
- [moduleName](WorkspaceRegistration.md#modulename)
- [name](WorkspaceRegistration.md#name)
- [preferredWindowSize](WorkspaceRegistration.md#preferredwindowsize)
- [sidebarFamily](WorkspaceRegistration.md#sidebarfamily)
- [title](WorkspaceRegistration.md#title)
- [titleNode](WorkspaceRegistration.md#titlenode)
- [type](WorkspaceRegistration.md#type)
- [width](WorkspaceRegistration.md#width)

### Methods

- [load](WorkspaceRegistration.md#load)

## Properties

### canHide

• **canHide**: `boolean`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L14)

___

### canMaximize

• **canMaximize**: `boolean`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L15)

___

### cancelConfirmText

• `Optional` **cancelConfirmText**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L19)

___

### cancelMessage

• `Optional` **cancelMessage**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L18)

___

### cancelTitle

• `Optional` **cancelTitle**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L17)

___

### hasOwnSidebar

• **hasOwnSidebar**: `boolean`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L20)

___

### moduleName

• **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L24)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L10)

___

### preferredWindowSize

• **preferredWindowSize**: [`WorkspaceWindowState`](../API.md#workspacewindowstate)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L22)

___

### sidebarFamily

• **sidebarFamily**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L21)

___

### title

• **title**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L11)

___

### titleNode

• `Optional` **titleNode**: `ReactNode`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L12)

___

### type

• **type**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L13)

___

### width

• **width**: ``"narrow"`` \| ``"wider"`` \| ``"extra-wide"``

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L16)

## Methods

### load

▸ **load**(): `Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Returns

`Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L23)
