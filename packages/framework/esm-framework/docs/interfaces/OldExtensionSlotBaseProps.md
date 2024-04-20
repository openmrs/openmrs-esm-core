[@openmrs/esm-framework](../API.md) / OldExtensionSlotBaseProps

# Interface: OldExtensionSlotBaseProps

## Table of contents

### Extension Properties

- [extensionSlotName](OldExtensionSlotBaseProps.md#extensionslotname)
- [name](OldExtensionSlotBaseProps.md#name)
- [state](OldExtensionSlotBaseProps.md#state)

### Extension Methods

- [select](OldExtensionSlotBaseProps.md#select)

## Extension Properties

### extensionSlotName

• **extensionSlotName**: `string`

**`deprecated`** Use `name`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L19)

___

### name

• `Optional` **name**: `string`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L17)

___

### state

• `Optional` **state**: `Record`<`string`, `any`\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L21)

## Extension Methods

### select

▸ `Optional` **select**(`extensions`): [`ConnectedExtension`](ConnectedExtension.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensions` | [`ConnectedExtension`](ConnectedExtension.md)[] |

#### Returns

[`ConnectedExtension`](ConnectedExtension.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L20)
