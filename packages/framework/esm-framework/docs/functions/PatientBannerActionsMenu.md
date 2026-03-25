[O3 Framework](../API.md) / PatientBannerActionsMenu

# Function: PatientBannerActionsMenu()

> **PatientBannerActionsMenu**(`__namedParameters`): `null` \| `Element`

Defined in: [packages/framework/esm-styleguide/src/patient-banner/actions-menu/patient-banner-actions-menu.component.tsx:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/patient-banner/actions-menu/patient-banner-actions-menu.component.tsx#L27)

Overflow menu for the patient banner whose items come from an ExtensionSlot
rather than direct React children. Because cloneElement cannot inject props
into extension-rendered components, arrow key navigation is handled at the
container level via onKeyDown instead of delegating to Carbon's OverflowMenuItem.

## Parameters

### \_\_namedParameters

[`PatientBannerActionsMenuProps`](../interfaces/PatientBannerActionsMenuProps.md)

## Returns

`null` \| `Element`
