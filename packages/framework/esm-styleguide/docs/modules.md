[@openmrs/esm-styleguide](API.md) / Exports

# @openmrs/esm-styleguide

## Table of contents

### Functions

- [integrateBreakpoints](modules.md#integratebreakpoints)
- [renderInlineNotifications](modules.md#renderinlinenotifications)
- [renderLoadingSpinner](modules.md#renderloadingspinner)
- [renderToasts](modules.md#rendertoasts)
- [showNotification](modules.md#shownotification)
- [showToast](modules.md#showtoast)

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
