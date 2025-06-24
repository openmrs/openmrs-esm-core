[@openmrs/esm-framework](../API.md) / ToastNotificationMeta

# Interface: ToastNotificationMeta

## Hierarchy

- [`ToastDescriptor`](ToastDescriptor.md)

  ↳ **`ToastNotificationMeta`**

## Table of contents

### UI Properties

- [actionButtonLabel](ToastNotificationMeta.md#actionbuttonlabel)
- [critical](ToastNotificationMeta.md#critical)
- [description](ToastNotificationMeta.md#description)
- [id](ToastNotificationMeta.md#id)
- [kind](ToastNotificationMeta.md#kind)
- [title](ToastNotificationMeta.md#title)

### UI Methods

- [onActionButtonClick](ToastNotificationMeta.md#onactionbuttonclick)

## UI Properties

### actionButtonLabel

• `Optional` **actionButtonLabel**: `string`

#### Inherited from

[ToastDescriptor](ToastDescriptor.md).[actionButtonLabel](ToastDescriptor.md#actionbuttonlabel)

#### Defined in

[packages/framework/esm-styleguide/src/toasts/toast.component.tsx:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/toast.component.tsx#L13)

___

### critical

• `Optional` **critical**: `boolean`

#### Inherited from

[ToastDescriptor](ToastDescriptor.md).[critical](ToastDescriptor.md#critical)

#### Defined in

[packages/framework/esm-styleguide/src/toasts/toast.component.tsx:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/toast.component.tsx#L15)

___

### description

• **description**: `ReactNode`

#### Inherited from

[ToastDescriptor](ToastDescriptor.md).[description](ToastDescriptor.md#description)

#### Defined in

[packages/framework/esm-styleguide/src/toasts/toast.component.tsx:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/toast.component.tsx#L11)

___

### id

• **id**: `number`

#### Defined in

[packages/framework/esm-styleguide/src/toasts/toast.component.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/toast.component.tsx#L20)

___

### kind

• `Optional` **kind**: [`ToastType`](../API.md#toasttype)

#### Inherited from

[ToastDescriptor](ToastDescriptor.md).[kind](ToastDescriptor.md#kind)

#### Defined in

[packages/framework/esm-styleguide/src/toasts/toast.component.tsx:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/toast.component.tsx#L14)

___

### title

• `Optional` **title**: `string`

#### Inherited from

[ToastDescriptor](ToastDescriptor.md).[title](ToastDescriptor.md#title)

#### Defined in

[packages/framework/esm-styleguide/src/toasts/toast.component.tsx:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/toast.component.tsx#L16)

## UI Methods

### onActionButtonClick

▸ `Optional` **onActionButtonClick**(): `void`

#### Returns

`void`

#### Inherited from

[ToastDescriptor](ToastDescriptor.md).[onActionButtonClick](ToastDescriptor.md#onactionbuttonclick)

#### Defined in

[packages/framework/esm-styleguide/src/toasts/toast.component.tsx:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/toast.component.tsx#L12)
