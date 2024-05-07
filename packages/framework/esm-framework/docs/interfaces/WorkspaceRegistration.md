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
- [moduleName](WorkspaceRegistration.md#modulename)
- [name](WorkspaceRegistration.md#name)
- [preferredWindowSize](WorkspaceRegistration.md#preferredwindowsize)
- [title](WorkspaceRegistration.md#title)
- [type](WorkspaceRegistration.md#type)
- [width](WorkspaceRegistration.md#width)

### Workspace Methods

- [load](WorkspaceRegistration.md#load)

## Workspace Properties

### canHide

• **canHide**: `boolean`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L40)

___

### canMaximize

• **canMaximize**: `boolean`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L41)

___

### moduleName

• **moduleName**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L45)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L37)

___

### preferredWindowSize

• **preferredWindowSize**: [`WorkspaceWindowState`](../API.md#workspacewindowstate)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L43)

___

### title

• **title**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L38)

___

### type

• **type**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L39)

___

### width

• **width**: ``"narrow"`` \| ``"wider"``

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L42)

## Workspace Methods

### load

▸ **load**(): `Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Returns

`Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L44)
