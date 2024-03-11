[@openmrs/esm-framework](../API.md) / ShowToastEvent

# Interface: ShowToastEvent

## Table of contents

### Properties

- [actionButtonLabel](ShowToastEvent.md#actionbuttonlabel)
- [description](ShowToastEvent.md#description)
- [kind](ShowToastEvent.md#kind)
- [title](ShowToastEvent.md#title)

### Methods

- [onActionButtonClick](ShowToastEvent.md#onactionbuttonclick)

## Properties

### actionButtonLabel

• `Optional` **actionButtonLabel**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L62)

___

### description

• **description**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L59)

___

### kind

• `Optional` **kind**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-globals/src/events.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L60)

___

### title

• `Optional` **title**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L61)

## Methods

### onActionButtonClick

▸ `Optional` **onActionButtonClick**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L63)
