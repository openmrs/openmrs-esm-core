[Back to README.md](../README.md)

# @openmrs/esm-react-utils

## Table of contents

### Interfaces

- [ComponentConfig](interfaces/componentconfig.md)
- [ComponentDecoratorOptions](interfaces/componentdecoratoroptions.md)
- [ConfigurableLinkProps](interfaces/configurablelinkprops.md)
- [ExtensionData](interfaces/extensiondata.md)
- [ExtensionProps](interfaces/extensionprops.md)
- [ExtensionSlotBaseProps](interfaces/extensionslotbaseprops.md)
- [OpenmrsReactComponentProps](interfaces/openmrsreactcomponentprops.md)
- [OpenmrsReactComponentState](interfaces/openmrsreactcomponentstate.md)
- [UserHasAccessProps](interfaces/userhasaccessprops.md)

### Type aliases

- [Actions](API.md#actions)
- [BoundActions](API.md#boundactions)
- [ExtensionSlotProps](API.md#extensionslotprops)
- [LayoutType](API.md#layouttype)

### Navigation Variables

- [ConfigurableLink](API.md#configurablelink)

### Other Variables

- [ComponentContext](API.md#componentcontext)
- [Extension](API.md#extension)
- [ExtensionSlot](API.md#extensionslot)
- [UserHasAccess](API.md#userhasaccess)

### Functions

- [createUseStore](API.md#createusestore)
- [getAsyncExtensionLifecycle](API.md#getasyncextensionlifecycle)
- [getAsyncLifecycle](API.md#getasynclifecycle)
- [getLifecycle](API.md#getlifecycle)
- [openmrsComponentDecorator](API.md#openmrscomponentdecorator)
- [useConfig](API.md#useconfig)
- [useCurrentPatient](API.md#usecurrentpatient)
- [useExtensionStore](API.md#useextensionstore)
- [useForceUpdate](API.md#useforceupdate)
- [useLayoutType](API.md#uselayouttype)
- [useNavigationContext](API.md#usenavigationcontext)
- [useStore](API.md#usestore)

## Type aliases

### Actions

Ƭ **Actions**: Function \| { [key: string]: Function;  }

Defined in: [packages/esm-react-utils/src/createUseStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/createUseStore.ts#L4)

___

### BoundActions

Ƭ **BoundActions**: *object*

#### Type declaration:

Defined in: [packages/esm-react-utils/src/createUseStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/createUseStore.ts#L5)

___

### ExtensionSlotProps

Ƭ **ExtensionSlotProps**: [*ExtensionSlotBaseProps*](interfaces/extensionslotbaseprops.md) & *React.HTMLAttributes*<HTMLDivElement\>

Defined in: [packages/esm-react-utils/src/ExtensionSlot.tsx:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/ExtensionSlot.tsx#L28)

___

### LayoutType

Ƭ **LayoutType**: *tablet* \| *phone* \| *desktop*

Defined in: [packages/esm-react-utils/src/useLayoutType.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useLayoutType.ts#L3)

## Navigation Variables

### ConfigurableLink

• `Const` **ConfigurableLink**: *React.FC*<[*ConfigurableLinkProps*](interfaces/configurablelinkprops.md)\>

A React link component which calls [[navigate]] when clicked

**`param`** The target path or URL. Supports interpolation. See [[navigate]]

**`param`** Inline elements within the link

**`param`** Any other valid props for an <a> tag except `href` and `onClick`

Defined in: [packages/esm-react-utils/src/ConfigurableLink.tsx:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/ConfigurableLink.tsx#L29)

___

## Other Variables

### ComponentContext

• `Const` **ComponentContext**: *Context*<[*ComponentConfig*](interfaces/componentconfig.md)\>

Available to all components. Provided by `openmrsComponentDecorator`.

Defined in: [packages/esm-react-utils/src/ComponentContext.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/ComponentContext.ts#L18)

___

### Extension

• `Const` **Extension**: *React.FC*<[*ExtensionProps*](interfaces/extensionprops.md)\>

Represents the position in the DOM where each extension within
an extension slot is rendered.

Renders once for each extension attached to that extension slot.

Usage of this component *must* have an ancestor `<ExtensionSlot>`.

Defined in: [packages/esm-react-utils/src/Extension.tsx:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/Extension.tsx#L17)

___

### ExtensionSlot

• `Const` **ExtensionSlot**: *React.FC*<[*ExtensionSlotProps*](API.md#extensionslotprops)\>

Defined in: [packages/esm-react-utils/src/ExtensionSlot.tsx:31](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/ExtensionSlot.tsx#L31)

___

### UserHasAccess

• `Const` **UserHasAccess**: *React.FC*<[*UserHasAccessProps*](interfaces/userhasaccessprops.md)\>

Defined in: [packages/esm-react-utils/src/UserHasAccess.tsx:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/UserHasAccess.tsx#L8)

## Functions

### createUseStore

▸ **createUseStore**<T\>(`store`: *Store*<T\>): *function*

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`store` | *Store*<T\> |

**Returns:** () => T(`actions`: [*Actions*](API.md#actions)) => T & [*BoundActions*](API.md#boundactions)(`actions?`: [*Actions*](API.md#actions)) => T & [*BoundActions*](API.md#boundactions)

Defined in: [packages/esm-react-utils/src/createUseStore.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/createUseStore.ts#L21)

___

### getAsyncExtensionLifecycle

▸ `Const`**getAsyncExtensionLifecycle**<T\>(`lazy`: () => *Promise*<{ `default`: *React.ComponentType*<T\>  }\>, `options`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): *function*

**`deprecated`** Use getAsyncLifecycle instead.

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`lazy` | () => *Promise*<{ `default`: *React.ComponentType*<T\>  }\> |
`options` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** () => *Promise*<Lifecycles\>

Defined in: [packages/esm-react-utils/src/getLifecycle.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/getLifecycle.ts#L31)

___

### getAsyncLifecycle

▸ **getAsyncLifecycle**<T\>(`lazy`: () => *Promise*<{ `default`: *React.ComponentType*<T\>  }\>, `options`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): *function*

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`lazy` | () => *Promise*<{ `default`: *React.ComponentType*<T\>  }\> |
`options` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** () => *Promise*<Lifecycles\>

Defined in: [packages/esm-react-utils/src/getLifecycle.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/getLifecycle.ts#L20)

___

### getLifecycle

▸ **getLifecycle**<T\>(`Component`: *React.ComponentType*<T\>, `options`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): Lifecycles

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`Component` | *React.ComponentType*<T\> |
`options` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** Lifecycles

Defined in: [packages/esm-react-utils/src/getLifecycle.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/getLifecycle.ts#L9)

___

### openmrsComponentDecorator

▸ **openmrsComponentDecorator**(`userOpts`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`userOpts` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** (`Comp`: *ComponentType*<{}\>) => *typeof* OpenmrsReactComponent

Defined in: [packages/esm-react-utils/src/openmrsComponentDecorator.tsx:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/openmrsComponentDecorator.tsx#L71)

___

### useConfig

▸ **useConfig**(): ConfigObject

Use this React Hook to obtain your module's configuration.

**Returns:** ConfigObject

Defined in: [packages/esm-react-utils/src/useConfig.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useConfig.ts#L22)

___

### useCurrentPatient

▸ **useCurrentPatient**(): [*boolean*, NullablePatient, PatientUuid, Error \| *null*]

**Returns:** [*boolean*, NullablePatient, PatientUuid, Error \| *null*]

Defined in: [packages/esm-react-utils/src/useCurrentPatient.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useCurrentPatient.ts#L12)

___

### useExtensionStore

▸ `Const`**useExtensionStore**(): T

**Returns:** T

Defined in: [packages/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useExtensionStore.ts#L4)

▸ `Const`**useExtensionStore**(`actions`: [*Actions*](API.md#actions)): T & [*BoundActions*](API.md#boundactions)

#### Parameters:

Name | Type |
:------ | :------ |
`actions` | [*Actions*](API.md#actions) |

**Returns:** T & [*BoundActions*](API.md#boundactions)

Defined in: [packages/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useExtensionStore.ts#L4)

▸ `Const`**useExtensionStore**(`actions?`: [*Actions*](API.md#actions)): T & [*BoundActions*](API.md#boundactions)

#### Parameters:

Name | Type |
:------ | :------ |
`actions?` | [*Actions*](API.md#actions) |

**Returns:** T & [*BoundActions*](API.md#boundactions)

Defined in: [packages/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useExtensionStore.ts#L4)

___

### useForceUpdate

▸ **useForceUpdate**(): *function*

**Returns:** () => *void*

Defined in: [packages/esm-react-utils/src/useForceUpdate.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useForceUpdate.ts#L3)

___

### useLayoutType

▸ **useLayoutType**(): [*LayoutType*](API.md#layouttype)

**Returns:** [*LayoutType*](API.md#layouttype)

Defined in: [packages/esm-react-utils/src/useLayoutType.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useLayoutType.ts#L22)

___

### useNavigationContext

▸ **useNavigationContext**(`context`: NavigationContext): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`context` | NavigationContext |

**Returns:** *void*

Defined in: [packages/esm-react-utils/src/useNavigationContext.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useNavigationContext.ts#L7)

___

### useStore

▸ **useStore**<T\>(`store`: *Store*<T\>): T

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`store` | *Store*<T\> |

**Returns:** T

Defined in: [packages/esm-react-utils/src/useStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useStore.ts#L4)

▸ **useStore**<T\>(`store`: *Store*<T\>, `actions`: [*Actions*](API.md#actions)): T & [*BoundActions*](API.md#boundactions)

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`store` | *Store*<T\> |
`actions` | [*Actions*](API.md#actions) |

**Returns:** T & [*BoundActions*](API.md#boundactions)

Defined in: [packages/esm-react-utils/src/useStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-react-utils/src/useStore.ts#L5)
