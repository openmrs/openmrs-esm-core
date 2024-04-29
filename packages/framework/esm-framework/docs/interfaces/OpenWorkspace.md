[@openmrs/esm-framework](../API.md) / OpenWorkspace

# Interface: OpenWorkspace

## Hierarchy

- [`WorkspaceRegistration`](WorkspaceRegistration.md)

  ↳ **`OpenWorkspace`**

## Table of contents

### Workspace Properties

- [additionalProps](OpenWorkspace.md#additionalprops)
- [canHide](OpenWorkspace.md#canhide)
- [canMaximize](OpenWorkspace.md#canmaximize)
- [moduleName](OpenWorkspace.md#modulename)
- [name](OpenWorkspace.md#name)
- [preferredWindowSize](OpenWorkspace.md#preferredwindowsize)
- [title](OpenWorkspace.md#title)
- [type](OpenWorkspace.md#type)
- [width](OpenWorkspace.md#width)

### Other Methods

- [closeWorkspace](OpenWorkspace.md#closeworkspace)
- [closeWorkspaceWithSavedChanges](OpenWorkspace.md#closeworkspacewithsavedchanges)
- [promptBeforeClosing](OpenWorkspace.md#promptbeforeclosing)

### Workspace Methods

- [load](OpenWorkspace.md#load)

## Workspace Properties

### additionalProps

• **additionalProps**: `object`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L49)

___

### canHide

• **canHide**: `boolean`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[canHide](WorkspaceRegistration.md#canhide)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L40)

___

### canMaximize

• **canMaximize**: `boolean`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[canMaximize](WorkspaceRegistration.md#canmaximize)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L41)

___

### moduleName

• **moduleName**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[moduleName](WorkspaceRegistration.md#modulename)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L45)

___

### name

• **name**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[name](WorkspaceRegistration.md#name)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L37)

___

### preferredWindowSize

• **preferredWindowSize**: [`WorkspaceWindowState`](../API.md#workspacewindowstate)

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[preferredWindowSize](WorkspaceRegistration.md#preferredwindowsize)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L43)

___

### title

• **title**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[title](WorkspaceRegistration.md#title)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L38)

___

### type

• **type**: `string`

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[type](WorkspaceRegistration.md#type)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L39)

___

### width

• **width**: ``"narrow"`` \| ``"wider"``

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[width](WorkspaceRegistration.md#width)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L42)

## Other Methods

### closeWorkspace

▸ **closeWorkspace**(`closeWorkspaceOptions?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `closeWorkspaceOptions?` | [`CloseWorkspaceOptions`](CloseWorkspaceOptions.md) |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:50](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L50)

___

### closeWorkspaceWithSavedChanges

▸ **closeWorkspaceWithSavedChanges**(`closeWorkspaceOptions?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `closeWorkspaceOptions?` | [`CloseWorkspaceOptions`](CloseWorkspaceOptions.md) |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:51](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L51)

___

### promptBeforeClosing

▸ **promptBeforeClosing**(`testFcn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `testFcn` | () => `boolean` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L52)

___

## Workspace Methods

### load

▸ **load**(): `Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Returns

`Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Inherited from

[WorkspaceRegistration](WorkspaceRegistration.md).[load](WorkspaceRegistration.md#load)

#### Defined in

[packages/framework/esm-styleguide/src/workspaces/workspaces.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L44)
