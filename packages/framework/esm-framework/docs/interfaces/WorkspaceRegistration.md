[@openmrs/esm-framework](../API.md) / WorkspaceRegistration

# Interface: WorkspaceRegistration

See [WorkspaceDefinition](../API.md#workspacedefinition) for more information about these properties

## Hierarchy

- **`WorkspaceRegistration`**

  ↳ [`OpenWorkspace`](OpenWorkspace.md)

## Table of contents

### Workspace Properties

- [canHide](WorkspaceRegistration.md#canhide)
- [canMaximize](WorkspaceRegistration.md#canmaximize)
- [hasOwnSidebar](WorkspaceRegistration.md#hasownsidebar)
- [moduleName](WorkspaceRegistration.md#modulename)
- [name](WorkspaceRegistration.md#name)
- [preferredWindowSize](WorkspaceRegistration.md#preferredwindowsize)
- [sidebarFamily](WorkspaceRegistration.md#sidebarfamily)
- [title](WorkspaceRegistration.md#title)
- [type](WorkspaceRegistration.md#type)
- [width](WorkspaceRegistration.md#width)

### Workspace Methods

- [load](WorkspaceRegistration.md#load)

## Workspace Properties

### canHide

• **canHide**: `boolean`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L35)

___

### canMaximize

• **canMaximize**: `boolean`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L36)

___

### hasOwnSidebar

• **hasOwnSidebar**: `boolean`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L38)

___

### moduleName

• **moduleName**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L42)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L32)

___

### preferredWindowSize

• **preferredWindowSize**: [`WorkspaceWindowState`](../API.md#workspacewindowstate)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L40)

___

### sidebarFamily

• **sidebarFamily**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L39)

___

### title

• **title**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L33)

___

### type

• **type**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L34)

___

### width

• **width**: ``"narrow"`` \| ``"wider"`` \| ``"extra-wide"``

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L37)

## Workspace Methods

### load

▸ **load**(): `Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Returns

`Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L41)
