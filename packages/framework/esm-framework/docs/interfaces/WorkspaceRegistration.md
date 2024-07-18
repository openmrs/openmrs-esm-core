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

### hasOwnSidebar

• **hasOwnSidebar**: `boolean`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L17)

___

### moduleName

• **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L21)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L10)

___

### preferredWindowSize

• **preferredWindowSize**: [`WorkspaceWindowState`](../API.md#workspacewindowstate)

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L19)

___

### sidebarFamily

• **sidebarFamily**: `string`

#### Defined in

[packages/framework/esm-extensions/src/workspaces.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L18)

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

[packages/framework/esm-extensions/src/workspaces.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/workspaces.ts#L20)
