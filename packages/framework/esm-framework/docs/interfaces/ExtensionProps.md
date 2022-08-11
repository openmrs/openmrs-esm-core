[@openmrs/esm-framework](../API.md) / ExtensionProps

# Interface: ExtensionProps

## Table of contents

### Properties

- [state](ExtensionProps.md#state)

### Methods

- [wrap](ExtensionProps.md#wrap)

## Properties

### state

• `Optional` **state**: `Record`<`string`, `any`\>

#### Defined in

[packages/framework/esm-react-utils/src/Extension.tsx:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/Extension.tsx#L14)

## Methods

### wrap

▸ `Optional` **wrap**(`slot`, `extension`): ``null`` \| `ReactElement`<`any`, `any`\>

**`deprecated`** Pass a function as the child of `ExtensionSlot` instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `ReactNode` |
| `extension` | [`ExtensionData`](ExtensionData.md) |

#### Returns

``null`` \| `ReactElement`<`any`, `any`\>

#### Defined in

[packages/framework/esm-react-utils/src/Extension.tsx:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/Extension.tsx#L16)
