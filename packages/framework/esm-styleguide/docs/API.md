[Back to README.md](../README.md)

# @openmrs/esm-styleguide

## Table of contents

### Functions

- [integrateBreakpoints](API.md#integratebreakpoints)
- [renderInlineNotifications](API.md#renderinlinenotifications)
- [renderLoadingSpinner](API.md#renderloadingspinner)
- [renderToasts](API.md#rendertoasts)
- [setupModalsContainer](API.md#setupmodalscontainer)
- [showModal](API.md#showmodal)
- [showNotification](API.md#shownotification)
- [showToast](API.md#showtoast)

## Functions

### integrateBreakpoints

▸ **integrateBreakpoints**(): `void`

#### Returns

`void`

#### Defined in

[breakpoints/index.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/breakpoints/index.ts#L20)

___

### renderInlineNotifications

▸ **renderInlineNotifications**(`target`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `HTMLElement` \| ``null`` |

#### Returns

`void`

#### Defined in

[notifications/index.tsx:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L14)

___

### renderLoadingSpinner

▸ **renderLoadingSpinner**(`target`): () => `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `HTMLElement` |

#### Returns

`fn`

▸ (): `any`

##### Returns

`any`

#### Defined in

[spinner/index.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/spinner/index.ts#L1)

___

### renderToasts

▸ **renderToasts**(`target`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `HTMLElement` \| ``null`` |

#### Returns

`void`

#### Defined in

[toasts/index.tsx:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/toasts/index.tsx#L11)

___

### setupModalsContainer

▸ **setupModalsContainer**(): `void`

#### Returns

`void`

#### Defined in

[modals/index.tsx:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/modals/index.tsx#L12)

___

### showModal

▸ **showModal**(`extensionId`, `props?`, `onClose?`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionId` | `string` |
| `props` | `Record`<string, any\> |
| `onClose` | () => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[modals/index.tsx:54](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/modals/index.tsx#L54)

___

### showNotification

▸ **showNotification**(`notification`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `notification` | `NotificationDescriptor` |

#### Returns

`void`

#### Defined in

[notifications/index.tsx:31](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L31)

___

### showToast

▸ **showToast**(`toast`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `toast` | `ToastDescriptor` |

#### Returns

`void`

#### Defined in

[toasts/index.tsx:25](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/toasts/index.tsx#L25)
