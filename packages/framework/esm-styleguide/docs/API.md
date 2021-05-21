[Back to README.md](../README.md)

# @openmrs/esm-styleguide

## Table of contents

### Enumerations

- [NotificationVariant](enums/notificationvariant.md)

### Functions

- [integrateBreakpoints](API.md#integratebreakpoints)
- [renderInlineNotifications](API.md#renderinlinenotifications)
- [renderLoadingSpinner](API.md#renderloadingspinner)
- [renderToasts](API.md#rendertoasts)
- [showNotification](API.md#shownotification)

## Functions

### integrateBreakpoints

▸ **integrateBreakpoints**(): *void*

**Returns:** *void*

Defined in: [breakpoints/index.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/breakpoints/index.ts#L20)

___

### renderInlineNotifications

▸ **renderInlineNotifications**(`target`: HTMLElement \| ``null``): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | HTMLElement \| ``null`` |

**Returns:** *void*

Defined in: [notifications/index.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L20)

___

### renderLoadingSpinner

▸ **renderLoadingSpinner**(`target`: HTMLElement): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | HTMLElement |

**Returns:** () => *any*

Defined in: [spinner/index.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/spinner/index.ts#L1)

___

### renderToasts

▸ **renderToasts**(`target`: HTMLElement \| ``null``): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | HTMLElement \| ``null`` |

**Returns:** *void*

Defined in: [notifications/index.tsx:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L29)

___

### showNotification

▸ **showNotification**(`notification`: NotificationDescriptor): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `notification` | NotificationDescriptor |

**Returns:** *void*

Defined in: [notifications/index.tsx:43](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L43)
