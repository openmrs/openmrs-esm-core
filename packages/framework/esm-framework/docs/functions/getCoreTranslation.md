[O3 Framework](../API.md) / getCoreTranslation

# Function: getCoreTranslation()

> **getCoreTranslation**(`key`, `defaultText?`, `options?`): `string`

Defined in: [packages/framework/esm-translations/src/index.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-translations/src/index.ts#L69)

Use this function to obtain a translation from the core translations. This is a way to avoid having
to define common translations in your app, and to ensure that translations are consistent across
different apps. This function is also used to obtain translations in the framework and app shell.

The complete set of core translations is available on the `CoreTranslationKey` type. Providing an
invalid key to this function will result in a type error.

## Parameters

### key

The translation key from the set of core translations.

`"error"` | `"cancel"` | `"change"` | `"close"` | `"unknown"` | `"state"` | `"Clinic"` | `"abnormalValue"` | `"actions"` | `"actionableNotification"` | `"address"` | `"age"` | `"applicationError"` | `"batchActionItemSelected"` | `"batchActionsItemsSelected"` | `"clearDevOverrides"` | `"closesActionableNotification"` | `"closeSnackbar"` | `"confirm"` | `"confirmed"` | `"contactAdministratorIfIssuePersists"` | `"contactDetails"` | `"copied"` | `"copyToClipboard"` | `"delete"` | `"discardChanges"` | `"edit"` | `"emptyStateText"` | `"errorCopy"` | `"errorLoadingLoginLocations"` | `"female"` | `"leftNavigation"` | `"loading"` | `"localVersion"` | `"male"` | `"navigateNonHttp"` | `"noResultsToDisplay"` | `"notAvailable"` | `"other"` | `"paginationItemsCount"` | `"paginationOfPages"` | `"patientAvatarAlt"` | `"patientIdentifierSticker"` | `"patientLists"` | `"patientPhotoAlt"` | `"patientPhotoPlaceholder"` | `"prereleaseVersion"` | `"print"` | `"printError"` | `"printErrorExplainer"` | `"printIdentifierSticker"` | `"printing"` | `"provisional"` | `"recordNewEntry"` | `"relationships"` | `"reload"` | `"resetOverrides"` | `"save"` | `"scriptLoadingFailed"` | `"scriptLoadingError"` | `"searchForLocation"` | `"seeAll"` | `"seeMoreLists"` | `"selectAll"` | `"serverStartingUp"` | `"serverStartingUpExplainer"` | `"serverStartingUpSlowExplainer"` | `"sex"` | `"showLess"` | `"showMore"` | `"snackbarNotification"` | `"somethingWentWrongTryReloading"` | `"toggleDevTools"` | `"viewSetupProgress"` | `"waitingForServer"` | `"yearAbbreviation"` | `"yearsAbbreviation"` | `"discardUnsavedChangesPromptBodyMultiple"` | `"discardUnsavedChangesPromptBodySingle"` | `"discardUnsavedChangesPromptTitle"` | `"keepEditing"` | `"closeAllOpenedWorkspaces"` | `"closingAllWorkspacesPromptBody"` | `"closingAllWorkspacesPromptTitle"` | `"discard"` | `"hide"` | `"maximize"` | `"minimize"` | `"openAnyway"` | `"unsavedChangesInOpenedWorkspace"` | `"unsavedChangesInWorkspace"` | `"unsavedChangesTitleText"` | `"workspaceHeader"` | `"address1"` | `"address2"` | `"address3"` | `"address4"` | `"address5"` | `"address6"` | `"city"` | `"cityVillage"` | `"country"` | `"countyDistrict"` | `"district"` | `"postalCode"` | `"stateProvince"`

### defaultText?

`string`

Optional fallback text if the translation is not found.

### options?

`Omit`\<`TOptions`, `"ns"` \| `"defaultValue"`\>

Object passed to the i18next `t` function. See https://www.i18next.com/translation-function/essentials#overview-options
          for more information. `ns` and `defaultValue` are already set and may not be used.

## Returns

`string`

The translated string.
