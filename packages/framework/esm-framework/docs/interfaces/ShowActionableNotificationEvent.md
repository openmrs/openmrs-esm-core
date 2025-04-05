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

[packages/framework/esm-globals/src/events.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L56)

___

### kind

• `Optional` **kind**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-globals/src/events.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L54)

___

### progressActionLabel

• `Optional` **progressActionLabel**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L58)

___

### subtitle

• **subtitle**: `any`

#### Defined in

[packages/framework/esm-globals/src/events.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L53)

___

### title

• `Optional` **title**: `string`

#### Defined in

[packages/framework/esm-globals/src/events.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L55)

## Methods

### onActionButtonClick

▸ **onActionButtonClick**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L57)
