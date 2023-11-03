[@openmrs/esm-framework](../API.md) / OldExtensionSlotBaseProps

# Interface: OldExtensionSlotBaseProps

## Table of contents

### Properties

- [extensionSlotName](OldExtensionSlotBaseProps.md#extensionslotname)
- [name](OldExtensionSlotBaseProps.md#name)
- [state](OldExtensionSlotBaseProps.md#state)

### Methods

- [select](OldExtensionSlotBaseProps.md#select)

## Properties

### extensionSlotName

• **extensionSlotName**: `string`

**`deprecated`** Use `name`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L18)

___

### name

• `Optional` **name**: `string`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L16)

___

### state

• `Optional` **state**: `Record`<`string`, `any`\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L20)

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

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L19)
