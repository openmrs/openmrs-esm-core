[@openmrs/esm-framework](../API.md) / ExtensionSlotBaseProps

# Interface: ExtensionSlotBaseProps

## Table of contents

### Properties

- [extensionSlotName](ExtensionSlotBaseProps.md#extensionslotname)
- [name](ExtensionSlotBaseProps.md#name)
- [state](ExtensionSlotBaseProps.md#state)

### Methods

- [select](ExtensionSlotBaseProps.md#select)

## Properties

### extensionSlotName

• `Optional` **extensionSlotName**: `string`

**`deprecated`** Use `name`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:45](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L45)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:43](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L43)

___

### state

• `Optional` **state**: `Record`<`string`, `any`\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:47](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L47)

## Methods

### select

▸ `Optional` **select**(`extensions`): [`ConnectedExtension`](ConnectedExtension.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensions` | [`ConnectedExtension`](ConnectedExtension.md)[] |

#### Returns

[`ConnectedExtension`](ConnectedExtension.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:46](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L46)
