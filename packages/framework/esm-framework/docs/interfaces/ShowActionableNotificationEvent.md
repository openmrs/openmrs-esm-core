[@openmrs/esm-framework](../API.md) / ShowActionableNotificationEvent

# Interface: ShowActionableNotificationEvent

## Table of contents

### Properties

- [actionButtonLabel](ShowActionableNotificationEvent.md#actionbuttonlabel)
- [kind](ShowActionableNotificationEvent.md#kind)
- [progressActionLabel](ShowActionableNotificationEvent.md#progressactionlabel)
- [subtitle](ShowActionableNotificationEvent.md#subtitle)
- [title](ShowActionableNotificationEvent.md#title)

### Methods

- [onActionButtonClick](ShowActionableNotificationEvent.md#onactionbuttonclick)

## Properties

### actionButtonLabel

• **actionButtonLabel**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:79](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L79)

___

### kind

• `Optional` **kind**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-globals/src/events.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L71)

___

### progressActionLabel

• `Optional` **progressActionLabel**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L81)

___

### subtitle

• **subtitle**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L70)

___

### title

• `Optional` **title**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L78)

## Methods

### onActionButtonClick

▸ **onActionButtonClick**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L80)
