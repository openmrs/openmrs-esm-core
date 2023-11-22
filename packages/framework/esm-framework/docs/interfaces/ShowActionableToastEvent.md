[@openmrs/esm-framework](../API.md) / ShowActionableToastEvent

# Interface: ShowActionableToastEvent

## Table of contents

### Properties

- [actionButtonLabel](ShowActionableToastEvent.md#actionbuttonlabel)
- [isLowContrast](ShowActionableToastEvent.md#islowcontrast)
- [kind](ShowActionableToastEvent.md#kind)
- [progressActionLabel](ShowActionableToastEvent.md#progressactionlabel)
- [subtitle](ShowActionableToastEvent.md#subtitle)
- [title](ShowActionableToastEvent.md#title)

### Methods

- [onActionButtonClick](ShowActionableToastEvent.md#onactionbuttonclick)

## Properties

### actionButtonLabel

• `Optional` **actionButtonLabel**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:127](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L127)

___

### isLowContrast

• `Optional` **isLowContrast**: `boolean`

#### Defined in

[packages/framework/esm-globals/src/events.ts:130](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L130)

___

### kind

• `Optional` **kind**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-globals/src/events.ts:119](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L119)

___

### progressActionLabel

• `Optional` **progressActionLabel**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:129](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L129)

___

### subtitle

• `Optional` **subtitle**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:118](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L118)

___

### title

• **title**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:126](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L126)

## Methods

### onActionButtonClick

▸ `Optional` **onActionButtonClick**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:128](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L128)
