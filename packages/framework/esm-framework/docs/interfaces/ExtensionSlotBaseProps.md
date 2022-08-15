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

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L10)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L8)

___

### state

• `Optional` **state**: `Record`<`string`, `any`\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L12)

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

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L11)
