[O3 Framework](../API.md) / getCoreTranslation

# Function: getCoreTranslation()

> **getCoreTranslation**(`key`, `defaultText?`, `options?`): `string`

Defined in: [packages/framework/esm-translations/src/index.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-translations/src/index.ts#L66)

Use this function to obtain a translation from the core translations. This is a way to avoid having
to define common translations in your app, and to ensure that translations are consistent across
different apps. This function is also used to obtain translations in the framework and app shell.

The complete set of core translations is available on the `CoreTranslationKey` type. Providing an
invalid key to this function will result in a type error.

## Parameters

### key

`"error"` | `"delete"` | `"actions"` | `"actionableNotification"` | `"address"` | `"age"` | `"cancel"` | `"change"` | `"Clinic"` | `"close"` | `"closesActionableNotification"` | `"closeSnackbar"` | `"confirm"` | `"contactAdministratorIfIssuePersists"` | `"contactDetails"` | `"discardChanges"` | `"edit"` | `"emptyStateText"` | `"errorCopy"` | `"errorLoadingLoginLocations"` | `"female"` | `"leftNavigation"` | `"loading"` | `"male"` | `"noResultsToDisplay"` | `"other"` | `"paginationItemsCount"` | `"paginationOfPages"` | `"patientAvatarAlt"` | `"patientIdentifierSticker"` | `"patientLists"` | `"patientPhotoAlt"` | `"patientPhotoPlaceholder"` | `"print"` | `"printError"` | `"printErrorExplainer"` | `"printIdentifierSticker"` | `"printing"` | `"recordNewEntry"` | `"relationships"` | `"resetOverrides"` | `"save"` | `"scriptLoadingFailed"` | `"scriptLoadingError"` | `"searchForLocation"` | `"seeAll"` | `"seeMoreLists"` | `"sex"` | `"showLess"` | `"showMore"` | `"snackbarNotification"` | `"toggleDevTools"` | `"unknown"` | `"yearAbbreviation"` | `"yearsAbbreviation"` | `"closeWorkspaces2PromptTitle"` | `"closeWorkspaces2PromptBody"` | `"closeAllOpenedWorkspaces"` | `"closingAllWorkspacesPromptBody"` | `"closingAllWorkspacesPromptTitle"` | `"discard"` | `"hide"` | `"maximize"` | `"minimize"` | `"openAnyway"` | `"unsavedChangesInOpenedWorkspace"` | `"unsavedChangesInWorkspace"` | `"unsavedChangesTitleText"` | `"workspaceHeader"` | `"address1"` | `"address2"` | `"address3"` | `"address4"` | `"address5"` | `"address6"` | `"city"` | `"cityVillage"` | `"country"` | `"countyDistrict"` | `"district"` | `"postalCode"` | `"state"` | `"stateProvince"`

### defaultText?

`string`

### options?

`Omit`\<`TOptions`, `"ns"` \| `"defaultValue"`\>

Object passed to the i18next `t` function. See https://www.i18next.com/translation-function/essentials#overview-options
          for more information. `ns` and `defaultValue` are already set and may not be used.

## Returns

`string`
