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

[packages/framework/esm-globals/src/events.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L72)

___

### isLowContrast

• `Optional` **isLowContrast**: `boolean`

#### Defined in

[packages/framework/esm-globals/src/events.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L75)

___

### kind

• `Optional` **kind**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-globals/src/events.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L70)

___

### progressActionLabel

• `Optional` **progressActionLabel**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L74)

___

### subtitle

• `Optional` **subtitle**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L69)

___

### timeoutInMs

• `Optional` **timeoutInMs**: `number`

#### Defined in

[packages/framework/esm-globals/src/events.ts:76](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L76)

___

### title

• **title**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L71)

## Methods

### onActionButtonClick

▸ `Optional` **onActionButtonClick**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:73](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L73)
