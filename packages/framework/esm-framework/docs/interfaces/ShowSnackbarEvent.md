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

[packages/framework/esm-globals/src/events.ts:111](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L111)

___

### isLowContrast

• `Optional` **isLowContrast**: `boolean`

#### Defined in

[packages/framework/esm-globals/src/events.ts:114](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L114)

___

### kind

• `Optional` **kind**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-globals/src/events.ts:103](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L103)

___

### progressActionLabel

• `Optional` **progressActionLabel**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:113](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L113)

___

### subtitle

• `Optional` **subtitle**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:102](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L102)

___

### timeoutInMs

• `Optional` **timeoutInMs**: `number`

#### Defined in

[packages/framework/esm-globals/src/events.ts:115](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L115)

___

### title

• **title**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:110](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L110)

## Methods

### onActionButtonClick

▸ `Optional` **onActionButtonClick**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L112)
