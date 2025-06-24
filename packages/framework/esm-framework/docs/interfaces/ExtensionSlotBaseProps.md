[O3 Framework](../API.md) / ExtensionSlotBaseProps

# Interface: ExtensionSlotBaseProps

Defined in: [packages/framework/esm-react-utils/src/ExtensionSlot.tsx:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L8)

## Extended by

- [`ExtensionSlotProps`](ExtensionSlotProps.md)

## Properties

### ~~extensionSlotName?~~

> `optional` **extensionSlotName**: `string`

Defined in: [packages/framework/esm-react-utils/src/ExtensionSlot.tsx:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L15)

The name of the extension slot

#### Deprecated

Use `name`

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-react-utils/src/ExtensionSlot.tsx:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L10)

The name of the extension slot

***

### select()?

> `optional` **select**: (`extensions`) => `AssignedExtension`[]

Defined in: [packages/framework/esm-react-utils/src/ExtensionSlot.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L20)

An optional function for filtering or otherwise modifying
  the list of extensions that will be rendered.

#### Parameters

##### extensions

`AssignedExtension`[]

#### Returns

`AssignedExtension`[]

***

### state?

> `optional` **state**: `Record`\<`string` \| `number` \| `symbol`, `unknown`\>

Defined in: [packages/framework/esm-react-utils/src/ExtensionSlot.tsx:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L27)

Only works if no children are provided*. Passes data
  through as props to the extensions that are mounted here. If `ExtensionSlot`
  has children, you must pass the state through the `state` param of the
  `Extension` component.
