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

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:53](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L53)

___

### name

• `Optional` **name**: `string`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:51](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L51)

___

### state

• `Optional` **state**: `Record`<`string`, `any`\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L55)

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

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:54](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L54)
