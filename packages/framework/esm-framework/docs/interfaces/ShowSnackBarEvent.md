[@openmrs/esm-framework](../API.md) / ShowSnackBarEvent

# Interface: ShowSnackBarEvent

## Table of contents

### Properties

- [actionButtonLabel](ShowSnackBarEvent.md#actionbuttonlabel)
- [kind](ShowSnackBarEvent.md#kind)
- [progressActionLabel](ShowSnackBarEvent.md#progressactionlabel)
- [subtitle](ShowSnackBarEvent.md#subtitle)
- [title](ShowSnackBarEvent.md#title)

### Methods

- [onActionButtonClick](ShowSnackBarEvent.md#onactionbuttonclick)

## Properties

### actionButtonLabel

• `Optional` **actionButtonLabel**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:109](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L109)

___

### kind

• `Optional` **kind**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-globals/src/events.ts:101](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L101)

___

### progressActionLabel

• `Optional` **progressActionLabel**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:111](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L111)

___

### subtitle

• `Optional` **subtitle**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:100](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L100)

___

### title

• **title**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:108](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L108)

## Methods

### onActionButtonClick

▸ `Optional` **onActionButtonClick**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:110](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L110)
