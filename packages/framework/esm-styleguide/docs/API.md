[Back to README.md](../README.md)

# @openmrs/esm-styleguide

## Table of contents

### Functions

- [integrateBreakpoints](API.md#integratebreakpoints)
- [renderInlineNotifications](API.md#renderinlinenotifications)
- [renderLoadingSpinner](API.md#renderloadingspinner)
- [renderModals](API.md#rendermodals)
- [renderToasts](API.md#rendertoasts)
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

Starts a rendering host for inline notifications. Should only be used by the app shell.
Under normal conditions there is no need to use this function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `HTMLElement` \| ``null`` | The container target that hosts the inline notifications. |

#### Returns

`void`

#### Defined in

[notifications/index.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L19)

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

### renderModals

▸ **renderModals**(`modalContainer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `modalContainer` | `HTMLElement` \| ``null`` |

#### Returns

`void`

#### Defined in

[modals/index.tsx:109](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/modals/index.tsx#L109)

___

### renderToasts

▸ **renderToasts**(`target`): `void`

Starts a rendering host for toast notifications. Should only be used by the app shell.
Under normal conditions there is no need to use this function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `HTMLElement` \| ``null`` | The container target that hosts the toast notifications. |

#### Returns

`void`

#### Defined in

[toasts/index.tsx:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/toasts/index.tsx#L16)

___

### showModal

▸ **showModal**(`extensionId`, `props?`, `onClose?`): () => `void`

Shows the provided extension component in a modal dialog.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionId` | `string` | The id of the extension to show. |
| `props` | `Record`<string, any\> | The optional props to provide to the extension. |
| `onClose` | () => `void` | The optional notification to receive when the modal is closed. |

#### Returns

`fn`

The dispose function to force closing the modal dialog.

▸ (): `void`

##### Returns

`void`

#### Defined in

[modals/index.tsx:163](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/modals/index.tsx#L163)

___

### showNotification

▸ **showNotification**(`notification`): `void`

Displays an inline notification in the UI.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `notification` | `NotificationDescriptor` | The description of the notification to display. |

#### Returns

`void`

#### Defined in

[notifications/index.tsx:40](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L40)

___

### showToast

▸ **showToast**(`toast`): `void`

Displays a toast notification in the UI.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `toast` | `ToastDescriptor` | The description of the toast to display. |

#### Returns

`void`

#### Defined in

[toasts/index.tsx:34](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/toasts/index.tsx#L34)
