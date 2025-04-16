[@openmrs/esm-framework](../API.md) / ShowSnackbarEvent

# Interface: ShowSnackbarEvent

## Table of contents

### Properties

- [actionButtonLabel](ShowSnackbarEvent.md#actionbuttonlabel)
- [isLowContrast](ShowSnackbarEvent.md#islowcontrast)
- [kind](ShowSnackbarEvent.md#kind)
- [progressActionLabel](ShowSnackbarEvent.md#progressactionlabel)
- [subtitle](ShowSnackbarEvent.md#subtitle)
- [timeoutInMs](ShowSnackbarEvent.md#timeoutinms)
- [title](ShowSnackbarEvent.md#title)

### Methods

- [onActionButtonClick](ShowSnackbarEvent.md#onactionbuttonclick)

## Properties

### actionButtonLabel

• `Optional` **actionButtonLabel**: `any`

#### Defined in

packages/framework/esm-globals/dist/events.d.ts:44

___

### isLowContrast

• `Optional` **isLowContrast**: `boolean`

#### Defined in

packages/framework/esm-globals/dist/events.d.ts:47

___

### kind

• `Optional` **kind**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

packages/framework/esm-globals/dist/events.d.ts:42

___

### progressActionLabel

• `Optional` **progressActionLabel**: `string`

#### Defined in

packages/framework/esm-globals/dist/events.d.ts:46

___

### subtitle

• `Optional` **subtitle**: `any`

#### Defined in

packages/framework/esm-globals/dist/events.d.ts:41

___

### timeoutInMs

• `Optional` **timeoutInMs**: `number`

#### Defined in

packages/framework/esm-globals/dist/events.d.ts:48

___

### title

• **title**: `string`

#### Defined in

packages/framework/esm-globals/dist/events.d.ts:43

## Methods

### onActionButtonClick

▸ `Optional` **onActionButtonClick**(): `void`

#### Returns

`void`

#### Defined in

packages/framework/esm-globals/dist/events.d.ts:45
