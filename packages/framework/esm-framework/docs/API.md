[Back to README.md](../README.md)

# @openmrs/esm-framework

## Table of contents

### API Functions

- [clearCurrentUser](API.md#clearcurrentuser)
- [fetchCurrentPatient](API.md#fetchcurrentpatient)
- [getCurrentUser](API.md#getcurrentuser)
- [getLocations](API.md#getlocations)
- [getLoggedInUser](API.md#getloggedinuser)
- [getSessionLocation](API.md#getsessionlocation)
- [getSessionStore](API.md#getsessionstore)
- [getVisitTypes](API.md#getvisittypes)
- [getVisitsForPatient](API.md#getvisitsforpatient)
- [makeUrl](API.md#makeurl)
- [openmrsFetch](API.md#openmrsfetch)
- [openmrsObservableFetch](API.md#openmrsobservablefetch)
- [refetchCurrentUser](API.md#refetchcurrentuser)
- [saveVisit](API.md#savevisit)
- [setSessionLocation](API.md#setsessionlocation)
- [toLocationObject](API.md#tolocationobject)
- [toVisitTypeObject](API.md#tovisittypeobject)
- [updateVisit](API.md#updatevisit)
- [useCurrentPatient](API.md#usecurrentpatient)
- [useLocations](API.md#uselocations)
- [usePatient](API.md#usepatient)
- [useSession](API.md#usesession)
- [useVisit](API.md#usevisit)
- [useVisitTypes](API.md#usevisittypes)
- [userHasAccess](API.md#userhasaccess-1)

### Breadcrumb Functions

- [filterBreadcrumbs](API.md#filterbreadcrumbs)
- [getBreadcrumbs](API.md#getbreadcrumbs)
- [getBreadcrumbsFor](API.md#getbreadcrumbsfor)
- [registerBreadcrumb](API.md#registerbreadcrumb)
- [registerBreadcrumbs](API.md#registerbreadcrumbs)

### Config Functions

- [defineConfigSchema](API.md#defineconfigschema)
- [defineExtensionConfigSchema](API.md#defineextensionconfigschema)
- [getConfig](API.md#getconfig)
- [provide](API.md#provide)
- [useConfig](API.md#useconfig)

### Config Validation Functions

- [inRange](API.md#inrange)
- [isUrl](API.md#isurl)
- [isUrlWithTemplateParameters](API.md#isurlwithtemplateparameters)
- [oneOf](API.md#oneof)
- [validator](API.md#validator-1)

### Date and Time Functions

- [formatDate](API.md#formatdate)
- [formatDatetime](API.md#formatdatetime)
- [formatTime](API.md#formattime)
- [isOmrsDateStrict](API.md#isomrsdatestrict)
- [isOmrsDateToday](API.md#isomrsdatetoday)
- [parseDate](API.md#parsedate)
- [toDateObjectStrict](API.md#todateobjectstrict)
- [toOmrsDateFormat](API.md#toomrsdateformat)
- [toOmrsDayDateFormat](API.md#toomrsdaydateformat)
- [toOmrsIsoString](API.md#toomrsisostring)
- [toOmrsTimeString](API.md#toomrstimestring)
- [toOmrsTimeString24](API.md#toomrstimestring24)
- [toOmrsYearlessDateFormat](API.md#toomrsyearlessdateformat)

### Error Handling Functions

- [createErrorHandler](API.md#createerrorhandler)
- [reportError](API.md#reporterror)

### Extension Functions

- [attach](API.md#attach)
- [detach](API.md#detach)
- [detachAll](API.md#detachall)
- [getAssignedExtensions](API.md#getassignedextensions)
- [getConnectedExtensions](API.md#getconnectedextensions)
- [getExtensionNameFromId](API.md#getextensionnamefromid)
- [getExtensionStore](API.md#getextensionstore)
- [renderExtension](API.md#renderextension)
- [useAssignedExtensionIds](API.md#useassignedextensionids)
- [useAssignedExtensions](API.md#useassignedextensions)
- [useConnectedExtensions](API.md#useconnectedextensions)
- [useExtensionSlotMeta](API.md#useextensionslotmeta)
- [useExtensionStore](API.md#useextensionstore)

### Framework Functions

- [getAsyncExtensionLifecycle](API.md#getasyncextensionlifecycle)
- [getAsyncLifecycle](API.md#getasynclifecycle)
- [getLifecycle](API.md#getlifecycle)
- [getSyncLifecycle](API.md#getsynclifecycle)

### Navigation Functions

- [ConfigurableLink](API.md#configurablelink)
- [interpolateString](API.md#interpolatestring)
- [interpolateUrl](API.md#interpolateurl)
- [navigate](API.md#navigate)

### Offline Functions

- [beginEditSynchronizationItem](API.md#begineditsynchronizationitem)
- [canBeginEditSynchronizationItemsOfType](API.md#canbegineditsynchronizationitemsoftype)
- [deleteSynchronizationItem](API.md#deletesynchronizationitem)
- [generateOfflineUuid](API.md#generateofflineuuid)
- [getCurrentOfflineMode](API.md#getcurrentofflinemode)
- [getDynamicOfflineDataEntries](API.md#getdynamicofflinedataentries)
- [getDynamicOfflineDataEntriesFor](API.md#getdynamicofflinedataentriesfor)
- [getDynamicOfflineDataHandlers](API.md#getdynamicofflinedatahandlers)
- [getFullSynchronizationItems](API.md#getfullsynchronizationitems)
- [getFullSynchronizationItemsFor](API.md#getfullsynchronizationitemsfor)
- [getOfflinePatientDataStore](API.md#getofflinepatientdatastore)
- [getSynchronizationItem](API.md#getsynchronizationitem)
- [getSynchronizationItems](API.md#getsynchronizationitems)
- [isOfflineUuid](API.md#isofflineuuid)
- [messageOmrsServiceWorker](API.md#messageomrsserviceworker)
- [putDynamicOfflineData](API.md#putdynamicofflinedata)
- [putDynamicOfflineDataFor](API.md#putdynamicofflinedatafor)
- [queueSynchronizationItem](API.md#queuesynchronizationitem)
- [registerOfflinePatientHandler](API.md#registerofflinepatienthandler)
- [removeDynamicOfflineData](API.md#removedynamicofflinedata)
- [removeDynamicOfflineDataFor](API.md#removedynamicofflinedatafor)
- [setupDynamicOfflineDataHandler](API.md#setupdynamicofflinedatahandler)
- [setupOfflineSync](API.md#setupofflinesync)
- [subscribeConnectivity](API.md#subscribeconnectivity)
- [subscribeConnectivityChanged](API.md#subscribeconnectivitychanged)
- [subscribePrecacheStaticDependencies](API.md#subscribeprecachestaticdependencies)
- [syncAllDynamicOfflineData](API.md#syncalldynamicofflinedata)
- [syncDynamicOfflineData](API.md#syncdynamicofflinedata)
- [syncOfflinePatientData](API.md#syncofflinepatientdata)
- [useConnectivity](API.md#useconnectivity)

### Other Functions

- [ExtensionSlot](API.md#extensionslot)

### Store Functions

- [createGlobalStore](API.md#createglobalstore)
- [createUseStore](API.md#createusestore)
- [getAppState](API.md#getappstate)
- [getGlobalStore](API.md#getglobalstore)
- [subscribeTo](API.md#subscribeto)
- [useStore](API.md#usestore)
- [useStoreWithActions](API.md#usestorewithactions)

### UI Functions

- [isDesktop](API.md#isdesktop)
- [setLeftNav](API.md#setleftnav)
- [showModal](API.md#showmodal)
- [showNotification](API.md#shownotification)
- [showToast](API.md#showtoast)
- [subscribeNotificationShown](API.md#subscribenotificationshown)
- [subscribeToastShown](API.md#subscribetoastshown)
- [unsetLeftNav](API.md#unsetleftnav)
- [useBodyScrollLock](API.md#usebodyscrolllock)
- [useLayoutType](API.md#uselayouttype)
- [useOnClickOutside](API.md#useonclickoutside)
- [usePagination](API.md#usepagination)

### Utility Functions

- [age](API.md#age)
- [daysIntoYear](API.md#daysintoyear)
- [isSameDay](API.md#issameday)
- [isVersionSatisfied](API.md#isversionsatisfied)
- [retry](API.md#retry)
- [translateFrom](API.md#translatefrom)

## API Type Aliases

### CurrentPatient

Ƭ **CurrentPatient**: `fhir.Patient` \| [`FetchResponse`](interfaces/FetchResponse.md)<`fhir.Patient`\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L5)

___

### LoadedSessionStore

Ƭ **LoadedSessionStore**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `loaded` | ``true`` |
| `session` | [`Session`](interfaces/Session.md) |

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L17)

___

### NullablePatient

Ƭ **NullablePatient**: `fhir.Patient` \| ``null``

#### Defined in

[packages/framework/esm-react-utils/src/usePatient.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/usePatient.ts#L5)

___

### PatientUuid

Ƭ **PatientUuid**: `string` \| ``null``

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L19)

___

### SessionStore

Ƭ **SessionStore**: [`LoadedSessionStore`](API.md#loadedsessionstore) \| [`UnloadedSessionStore`](API.md#unloadedsessionstore)

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L15)

___

### UnloadedSessionStore

Ƭ **UnloadedSessionStore**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `loaded` | ``false`` |
| `session` | ``null`` |

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L22)

___

## Date and Time Type Aliases

### DateInput

Ƭ **DateInput**: `string` \| `number` \| `Date`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L19)

___

### FormatDateMode

Ƭ **FormatDateMode**: ``"standard"`` \| ``"wide"``

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:140](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L140)

___

### FormatDateOptions

Ƭ **FormatDateOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `day` | `boolean` |  |
| `mode` | [`FormatDateMode`](API.md#formatdatemode) |  |
| `time` | `boolean` \| ``"for today"`` |  |
| `year` | `boolean` |  |

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:142](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L142)

___

## Navigation Type Aliases

### TemplateParams

Ƭ **TemplateParams**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/framework/esm-config/src/navigation/navigate.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/navigation/navigate.ts#L10)

___

## Offline Type Aliases

### KnownOmrsServiceWorkerMessages

Ƭ **KnownOmrsServiceWorkerMessages**: [`OnImportMapChangedMessage`](interfaces/OnImportMapChangedMessage.md) \| [`ClearDynamicRoutesMessage`](interfaces/ClearDynamicRoutesMessage.md) \| [`RegisterDynamicRouteMessage`](interfaces/RegisterDynamicRouteMessage.md)

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:46](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L46)

___

### OfflineMode

Ƭ **OfflineMode**: ``"on"`` \| ``"off"`` \| ``"unavailable"``

#### Defined in

[packages/framework/esm-offline/src/mode.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/mode.ts#L38)

___

### OmrsOfflineCachingStrategy

Ƭ **OmrsOfflineCachingStrategy**: ``"network-only-or-cache-only"`` \| ``"network-first"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L18)

___

### OmrsOfflineHttpHeaderNames

Ƭ **OmrsOfflineHttpHeaderNames**: keyof [`OmrsOfflineHttpHeaders`](API.md#omrsofflinehttpheaders)

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L45)

___

### OmrsOfflineHttpHeaders

Ƭ **OmrsOfflineHttpHeaders**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `x-omrs-offline-caching-strategy?` | [`OmrsOfflineCachingStrategy`](API.md#omrsofflinecachingstrategy) |  |
| `x-omrs-offline-response-body?` | `string` |  |
| `x-omrs-offline-response-status?` | \`${number}\` |  |

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L26)

___

## Other Type Aliases

### ConfigValue

Ƭ **ConfigValue**: `string` \| `number` \| `boolean` \| `void` \| `any`[] \| `object`

#### Defined in

[packages/framework/esm-config/src/types.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L37)

___

### ExtensionSlotProps

Ƭ **ExtensionSlotProps**: [`OldExtensionSlotBaseProps`](interfaces/OldExtensionSlotBaseProps.md) \| [`ExtensionSlotBaseProps`](interfaces/ExtensionSlotBaseProps.md) & `Omit`<`React.HTMLAttributes`<`HTMLDivElement`\>, ``"children"``\> & { `children?`: `React.ReactNode` \| (`extension`: [`ConnectedExtension`](interfaces/ConnectedExtension.md)) => `React.ReactNode`  }

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L23)

___

### ProvidedConfig

Ƭ **ProvidedConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](interfaces/Config.md) |
| `source` | `string` |

#### Defined in

[packages/framework/esm-config/src/types.ts:65](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L65)

___

### SpaEnvironment

Ƭ **SpaEnvironment**: ``"production"`` \| ``"development"`` \| ``"test"``

#### Defined in

[packages/framework/esm-globals/src/types.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L53)

___

### UpdateVisitPayload

Ƭ **UpdateVisitPayload**: [`NewVisitPayload`](interfaces/NewVisitPayload.md) & {}

#### Defined in

[packages/framework/esm-api/src/types/visit-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/visit-resource.ts#L12)

___

### Validator

Ƭ **Validator**: (`value`: `any`) => `void` \| `string`

#### Type declaration

▸ (`value`): `void` \| `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`void` \| `string`

#### Defined in

[packages/framework/esm-config/src/types.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L72)

___

### ValidatorFunction

Ƭ **ValidatorFunction**: (`value`: `any`) => `boolean`

#### Type declaration

▸ (`value`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`boolean`

#### Defined in

[packages/framework/esm-config/src/types.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L70)

___

## Store Type Aliases

### Actions

Ƭ **Actions**: `Function` \| { `[key: string]`: `Function`;  }

#### Defined in

[packages/framework/esm-react-utils/src/createUseStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/createUseStore.ts#L5)

___

### BoundActions

Ƭ **BoundActions**: `Object`

#### Index signature

▪ [key: `string`]: `BoundAction`

#### Defined in

[packages/framework/esm-react-utils/src/createUseStore.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/createUseStore.ts#L6)

___

## UI Type Aliases

### InlineNotificationType

Ƭ **InlineNotificationType**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-styleguide/src/notifications/notification.component.tsx:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/notifications/notification.component.tsx#L22)

___

### LayoutType

Ƭ **LayoutType**: ``"phone"`` \| ``"tablet"`` \| ``"small-desktop"`` \| ``"large-desktop"``

#### Defined in

[packages/framework/esm-react-utils/src/useLayoutType.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useLayoutType.ts#L4)

___

### ToastType

Ƭ **ToastType**: ``"error"`` \| ``"info"`` \| ``"info-square"`` \| ``"success"`` \| ``"warning"`` \| ``"warning-alt"``

#### Defined in

[packages/framework/esm-styleguide/src/toasts/toast.component.tsx:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/toast.component.tsx#L26)

## API Variables

### UserHasAccess

• `Const` **UserHasAccess**: `React.FC`<[`UserHasAccessProps`](interfaces/UserHasAccessProps.md)\>

#### Defined in

[packages/framework/esm-react-utils/src/UserHasAccess.tsx:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/UserHasAccess.tsx#L11)

___

### defaultVisitCustomRepresentation

• `Const` **defaultVisitCustomRepresentation**: `string`

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L12)

___

### fhir

• `Const` **fhir**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `read` | <T\>(`options`: [`FHIRRequestOptions`](interfaces/FHIRRequestOptions.md)) => `Promise`<{ `config`: [`FHIRRequestObj`](interfaces/FHIRRequestObj.md) ; `data`: `T` ; `headers`: `Headers` ; `status`: `number`  }\> |

#### Defined in

[packages/framework/esm-api/src/fhir.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/fhir.ts#L45)

___

### fhirBaseUrl

• `Const` **fhirBaseUrl**: ``"/ws/fhir2/R4"``

#### Defined in

[packages/framework/esm-api/src/fhir.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/fhir.ts#L5)

___

### getStartedVisit

• `Const` **getStartedVisit**: `BehaviorSubject`<``null`` \| [`VisitItem`](interfaces/VisitItem.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L74)

___

### sessionEndpoint

• `Const` **sessionEndpoint**: ``"/ws/rest/v1/session"``

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L7)

___

## Config Validation Variables

### validators

• `Const` **validators**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inRange` | (`min`: `number`, `max`: `number`) => [`Validator`](API.md#validator) |
| `isUrl` | [`Validator`](API.md#validator) |
| `isUrlWithTemplateParameters` | (`allowedTemplateParameters`: `string`[]) => [`Validator`](API.md#validator) |
| `oneOf` | (`allowedValues`: `any`[]) => [`Validator`](API.md#validator) |

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L69)

___

## Offline Variables

### offlineUuidPrefix

• `Const` **offlineUuidPrefix**: ``"OFFLINE+"``

#### Defined in

[packages/framework/esm-offline/src/uuid.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/uuid.ts#L4)

___

### omrsOfflineCachingStrategyHttpHeaderName

• `Const` **omrsOfflineCachingStrategyHttpHeaderName**: ``"x-omrs-offline-caching-strategy"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L7)

___

### omrsOfflineResponseBodyHttpHeaderName

• `Const` **omrsOfflineResponseBodyHttpHeaderName**: ``"x-omrs-offline-response-body"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L3)

___

### omrsOfflineResponseStatusHttpHeaderName

• `Const` **omrsOfflineResponseStatusHttpHeaderName**: ``"x-omrs-offline-response-status"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-http-headers.ts#L5)

___

## Other Variables

### ErrorState

• `Const` **ErrorState**: `React.FC`<[`ErrorStateProps`](interfaces/ErrorStateProps.md)\>

#### Defined in

[packages/framework/esm-styleguide/src/error-state/error-state.component.tsx:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/error-state/error-state.component.tsx#L12)

___

### Extension

• `Const` **Extension**: `React.FC`<[`ExtensionProps`](interfaces/ExtensionProps.md)\>

#### Defined in

[packages/framework/esm-react-utils/src/Extension.tsx:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/Extension.tsx#L31)

___

### backendDependencies

• `Const` **backendDependencies**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fhir2` | `string` |
| `webservices.rest` | `string` |

#### Defined in

[packages/framework/esm-api/src/openmrs-backend-dependencies.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-backend-dependencies.ts#L1)

___

## UI Variables

### LeftNavMenu

• `Const` **LeftNavMenu**: `ForwardRefExoticComponent`<`Pick`<`SideNavProps`, `string` \| `number` \| `symbol`\> & `RefAttributes`<`HTMLElement`\>\>

#### Defined in

[packages/framework/esm-styleguide/src/left-nav/index.tsx:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/left-nav/index.tsx#L30)

## API Functions

### clearCurrentUser

▸ **clearCurrentUser**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:188](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L188)

___

### fetchCurrentPatient

▸ **fetchCurrentPatient**(`patientUuid`, `contentOverrides?`): `Promise`<{ `config`: [`FHIRRequestObj`](interfaces/FHIRRequestObj.md) ; `data`: `Patient` ; `headers`: `Headers` ; `status`: `number`  }\> \| `Promise`<``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | [`PatientUuid`](API.md#patientuuid) |
| `contentOverrides?` | `Partial`<[`FHIRRequestOptions`](interfaces/FHIRRequestOptions.md)\> |

#### Returns

`Promise`<{ `config`: [`FHIRRequestObj`](interfaces/FHIRRequestObj.md) ; `data`: `Patient` ; `headers`: `Headers` ; `status`: `number`  }\> \| `Promise`<``null``\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L21)

___

### getCurrentUser

▸ **getCurrentUser**(): `Observable`<[`Session`](interfaces/Session.md)\>

#### Returns

`Observable`<[`Session`](interfaces/Session.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L71)

▸ **getCurrentUser**(`opts`): `Observable`<[`Session`](interfaces/Session.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.includeAuthStatus` | ``true`` |

#### Returns

`Observable`<[`Session`](interfaces/Session.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L72)

▸ **getCurrentUser**(`opts`): `Observable`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.includeAuthStatus` | ``false`` |

#### Returns

`Observable`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:73](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L73)

___

### getLocations

▸ **getLocations**(): `Observable`<[`Location`](interfaces/Location.md)[]\>

#### Returns

`Observable`<[`Location`](interfaces/Location.md)[]\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/location.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/location.ts#L14)

___

### getLoggedInUser

▸ **getLoggedInUser**(): `Promise`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Returns

`Promise`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:202](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L202)

___

### getSessionLocation

▸ **getSessionLocation**(): `Promise`<`undefined` \| [`SessionLocation`](interfaces/SessionLocation.md)\>

#### Returns

`Promise`<`undefined` \| [`SessionLocation`](interfaces/SessionLocation.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:220](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L220)

___

### getSessionStore

▸ **getSessionStore**(): `Store`<[`SessionStore`](API.md#sessionstore)\>

#### Returns

`Store`<[`SessionStore`](API.md#sessionstore)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:105](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L105)

___

### getVisitTypes

▸ **getVisitTypes**(): `Observable`<[`VisitType`](interfaces/VisitType.md)[]\>

#### Returns

`Observable`<[`VisitType`](interfaces/VisitType.md)[]\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-type.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-type.ts#L15)

___

### getVisitsForPatient

▸ **getVisitsForPatient**(`patientUuid`, `abortController`, `v?`): `Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<{ `results`: [`Visit`](interfaces/Visit.md)[]  }\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | `string` |
| `abortController` | `AbortController` |
| `v?` | `string` |

#### Returns

`Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<{ `results`: [`Visit`](interfaces/Visit.md)[]  }\>\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L20)

___

### makeUrl

▸ **makeUrl**(`path`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L19)

___

### openmrsFetch

▸ **openmrsFetch**<`T`\>(`path`, `fetchInit?`): `Promise`<[`FetchResponse`](interfaces/FetchResponse.md)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` |  |
| `fetchInit` | `FetchConfig` |  |

#### Returns

`Promise`<[`FetchResponse`](interfaces/FetchResponse.md)<`T`\>\>

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L72)

___

### openmrsObservableFetch

▸ **openmrsObservableFetch**<`T`\>(`url`, `fetchInit?`): `Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` |  |
| `fetchInit` | `FetchConfig` |  |

#### Returns

`Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<`T`\>\>

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:243](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L243)

___

### refetchCurrentUser

▸ **refetchCurrentUser**(): `Promise`<`unknown`\>

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:163](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L163)

___

### saveVisit

▸ **saveVisit**(`payload`, `abortController`): `Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`NewVisitPayload`](interfaces/NewVisitPayload.md) |
| `abortController` | `AbortController` |

#### Returns

`Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<`any`\>\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L45)

___

### setSessionLocation

▸ **setSessionLocation**(`locationUuid`, `abortController`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locationUuid` | `string` |
| `abortController` | `AbortController` |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:229](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L229)

___

### toLocationObject

▸ **toLocationObject**(`openmrsRestForm`): [`Location`](interfaces/Location.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `openmrsRestForm` | `any` |

#### Returns

[`Location`](interfaces/Location.md)

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/location.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/location.ts#L7)

___

### toVisitTypeObject

▸ **toVisitTypeObject**(`openmrsRestForm`): [`VisitType`](interfaces/VisitType.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `openmrsRestForm` | `any` |

#### Returns

[`VisitType`](interfaces/VisitType.md)

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-type.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-type.ts#L7)

___

### updateVisit

▸ **updateVisit**(`uuid`, `payload`, `abortController`): `Observable`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |
| `payload` | [`NewVisitPayload`](interfaces/NewVisitPayload.md) |
| `abortController` | `AbortController` |

#### Returns

`Observable`<`any`\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L59)

___

### useCurrentPatient

▸ **useCurrentPatient**(`patientUuid?`): [`boolean`, `NullablePatient`, [`PatientUuid`](API.md#patientuuid), `Error` \| ``null``]

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | [`PatientUuid`](API.md#patientuuid) |

#### Returns

[`boolean`, `NullablePatient`, [`PatientUuid`](API.md#patientuuid), `Error` \| ``null``]

#### Defined in

[packages/framework/esm-react-utils/src/useCurrentPatient.ts:83](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useCurrentPatient.ts#L83)

___

### useLocations

▸ **useLocations**(): [`Location`](interfaces/Location.md)[]

#### Returns

[`Location`](interfaces/Location.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useLocations.tsx:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useLocations.tsx#L5)

___

### usePatient

▸ **usePatient**(`patientUuid?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid?` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `error` | ``null`` \| `Error` |
| `isLoading` | `boolean` |
| `patient` | [`NullablePatient`](API.md#nullablepatient) |
| `patientUuid` | ``null`` \| `string` |

#### Defined in

[packages/framework/esm-react-utils/src/usePatient.ts:92](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/usePatient.ts#L92)

___

### useSession

▸ **useSession**(): [`Session`](interfaces/Session.md)

#### Returns

[`Session`](interfaces/Session.md)

#### Defined in

[packages/framework/esm-react-utils/src/useSession.tsx:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useSession.tsx#L17)

___

### useVisit

▸ **useVisit**(`patientUuid`): `VisitReturnType`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `patientUuid` | `string` |  |

#### Returns

`VisitReturnType`

#### Defined in

[packages/framework/esm-react-utils/src/useVisit.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L29)

___

### useVisitTypes

▸ **useVisitTypes**(): [`VisitType`](interfaces/VisitType.md)[]

#### Returns

[`VisitType`](interfaces/VisitType.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useVisitTypes.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisitTypes.ts#L5)

___

### userHasAccess

▸ **userHasAccess**(`requiredPrivilege`, `user`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `requiredPrivilege` | `string` \| `string`[] |
| `user` | `Object` |
| `user.privileges` | [`Privilege`](interfaces/Privilege.md)[] |
| `user.roles` | [`Role`](interfaces/Role.md)[] |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:195](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L195)

___

## Breadcrumb Functions

### filterBreadcrumbs

▸ **filterBreadcrumbs**(`list`, `path`): [`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `list` | [`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[] |
| `path` | `string` |

#### Returns

[`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[]

#### Defined in

[packages/framework/esm-breadcrumbs/src/filter.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/filter.ts#L43)

___

### getBreadcrumbs

▸ **getBreadcrumbs**(): [`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[]

#### Returns

[`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[]

#### Defined in

[packages/framework/esm-breadcrumbs/src/db.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/db.ts#L35)

___

### getBreadcrumbsFor

▸ **getBreadcrumbsFor**(`path`): [`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

[`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[]

#### Defined in

[packages/framework/esm-breadcrumbs/src/filter.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/filter.ts#L66)

___

### registerBreadcrumb

▸ **registerBreadcrumb**(`breadcrumb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `breadcrumb` | [`BreadcrumbSettings`](interfaces/BreadcrumbSettings.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-breadcrumbs/src/db.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/db.ts#L21)

___

### registerBreadcrumbs

▸ **registerBreadcrumbs**(`breadcrumbs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `breadcrumbs` | [`BreadcrumbSettings`](interfaces/BreadcrumbSettings.md)[] |

#### Returns

`void`

#### Defined in

[packages/framework/esm-breadcrumbs/src/db.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/db.ts#L25)

___

## Config Functions

### defineConfigSchema

▸ **defineConfigSchema**(`moduleName`, `schema`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` |  |
| `schema` | [`ConfigSchema`](interfaces/ConfigSchema.md) |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:192](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/module-config/module-config.ts#L192)

___

### defineExtensionConfigSchema

▸ **defineExtensionConfigSchema**(`extensionName`, `schema`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionName` | `string` |  |
| `schema` | [`ConfigSchema`](interfaces/ConfigSchema.md) |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:222](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/module-config/module-config.ts#L222)

___

### getConfig

▸ **getConfig**(`moduleName`): `Promise`<[`Config`](interfaces/Config.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` |  |

#### Returns

`Promise`<[`Config`](interfaces/Config.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:264](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/module-config/module-config.ts#L264)

___

### provide

▸ **provide**(`config`, `sourceName?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `config` | [`Config`](interfaces/Config.md) | `undefined` |
| `sourceName` | `string` | `"provided"` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:244](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/module-config/module-config.ts#L244)

___

### useConfig

▸ **useConfig**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `Display conditions?` | [`DisplayConditionsConfigObject`](interfaces/DisplayConditionsConfigObject.md) | - |
| `constructor` | `Function` |  |
| `hasOwnProperty` | (`v`: `PropertyKey`) => `boolean` |  |
| `isPrototypeOf` | (`v`: `Object`) => `boolean` |  |
| `propertyIsEnumerable` | (`v`: `PropertyKey`) => `boolean` |  |
| `toLocaleString` | () => `string` |  |
| `toString` | () => `string` |  |
| `valueOf` | () => `Object` |  |

#### Defined in

[packages/framework/esm-react-utils/src/useConfig.ts:163](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useConfig.ts#L163)

___

## Config Validation Functions

### inRange

▸ **inRange**(`min`, `max`): [`Validator`](API.md#validator)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` |  |
| `max` | `number` |  |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L10)

___

### isUrl

▸ **isUrl**(`value`): `string` \| `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`string` \| `void`

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L56)

___

### isUrlWithTemplateParameters

▸ **isUrlWithTemplateParameters**(`allowedTemplateParameters`): [`Validator`](API.md#validator)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowedTemplateParameters` | `string`[] |  |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L24)

___

### oneOf

▸ **oneOf**(`allowedValues`): [`Validator`](API.md#validator)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowedValues` | `any`[] |  |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L62)

___

### validator

▸ **validator**(`validationFunction`, `message`): [`Validator`](API.md#validator)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `validationFunction` | [`ValidatorFunction`](API.md#validatorfunction) |  |
| `message` | `string` \| (`value`: `any`) => `string` |  |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validator.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validator.ts#L25)

___

## Date and Time Functions

### formatDate

▸ **formatDate**(`date`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `options?` | `Partial`<[`FormatDateOptions`](API.md#formatdateoptions)\> |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:184](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L184)

___

### formatDatetime

▸ **formatDatetime**(`date`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `options?` | `Partial`<`Omit`<[`FormatDateOptions`](API.md#formatdateoptions), ``"time"``\>\> |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:251](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L251)

___

### formatTime

▸ **formatTime**(`date`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Date` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:235](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L235)

___

### isOmrsDateStrict

▸ **isOmrsDateStrict**(`omrsPayloadString`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `omrsPayloadString` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L27)

___

### isOmrsDateToday

▸ **isOmrsDateToday**(`date`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |  |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L64)

___

### parseDate

▸ **parseDate**(`dateString`): `Date`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dateString` | `string` |

#### Returns

`Date`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:136](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L136)

___

### toDateObjectStrict

▸ **toDateObjectStrict**(`omrsDateString`): `Date` \| ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `omrsDateString` | `string` |

#### Returns

`Date` \| ``null``

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L71)

___

### toOmrsDateFormat

▸ **toOmrsDateFormat**(`date`, `format?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) | `undefined` |
| `format` | `string` | `"YYYY-MMM-DD"` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:128](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L128)

___

### toOmrsDayDateFormat

▸ **toOmrsDayDateFormat**(`date`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L112)

___

### toOmrsIsoString

▸ **toOmrsIsoString**(`date`, `toUTC?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) | `undefined` |
| `toUTC` | `boolean` | `false` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:82](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L82)

___

### toOmrsTimeString

▸ **toOmrsTimeString**(`date`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L104)

___

### toOmrsTimeString24

▸ **toOmrsTimeString24**(`date`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:96](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L96)

___

### toOmrsYearlessDateFormat

▸ **toOmrsYearlessDateFormat**(`date`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:120](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/omrs-dates.ts#L120)

___

## Error Handling Functions

### createErrorHandler

▸ **createErrorHandler**(): (`incomingErr`: `any`) => `void`

#### Returns

`fn`

▸ (`incomingErr`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `incomingErr` | `any` |

##### Returns

`void`

#### Defined in

[packages/framework/esm-error-handling/src/index.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-error-handling/src/index.ts#L24)

___

### reportError

▸ **reportError**(`err`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `any` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-error-handling/src/index.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-error-handling/src/index.ts#L17)

___

## Extension Functions

### attach

▸ **attach**(`slotName`, `extensionId`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` |  |
| `extensionId` | `string` |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:174](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/extensions.ts#L174)

___

### detach

▸ **detach**(`extensionSlotName`, `extensionId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |
| `extensionId` | `string` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:205](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/extensions.ts#L205)

___

### detachAll

▸ **detachAll**(`extensionSlotName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:229](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/extensions.ts#L229)

___

### getAssignedExtensions

▸ **getAssignedExtensions**(`slotName`): [`AssignedExtension`](interfaces/AssignedExtension.md)[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` |  |

#### Returns

[`AssignedExtension`](interfaces/AssignedExtension.md)[]

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:359](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/extensions.ts#L359)

___

### getConnectedExtensions

▸ **getConnectedExtensions**(`assignedExtensions`, `online?`): [`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `assignedExtensions` | [`AssignedExtension`](interfaces/AssignedExtension.md)[] | `undefined` |  |
| `online` | ``null`` \| `boolean` | `null` |  |

#### Returns

[`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:287](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/extensions.ts#L287)

___

### getExtensionNameFromId

▸ **getExtensionNameFromId**(`extensionId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionId` | `string` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:118](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/extensions.ts#L118)

___

### getExtensionStore

▸ **getExtensionStore**(): `Store`<[`ExtensionStore`](interfaces/ExtensionStore.md)\>

#### Returns

`Store`<[`ExtensionStore`](interfaces/ExtensionStore.md)\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:130](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L130)

___

### renderExtension

▸ **renderExtension**(`domElement`, `extensionSlotName`, `extensionSlotModuleName`, `extensionId`, `renderFunction?`, `additionalProps?`): `Parcel` \| ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `domElement` | `HTMLElement` |
| `extensionSlotName` | `string` |
| `extensionSlotModuleName` | `string` |
| `extensionId` | `string` |
| `renderFunction` | (`lifecycle`: [`Lifecycle`](interfaces/Lifecycle.md)) => [`Lifecycle`](interfaces/Lifecycle.md) |
| `additionalProps` | `Record`<`string`, `any`\> |

#### Returns

`Parcel` \| ``null``

#### Defined in

[packages/framework/esm-extensions/src/render.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/render.ts#L17)

___

### useAssignedExtensionIds

▸ **useAssignedExtensionIds**(`slotName`): `string`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` |  |

#### Returns

`string`[]

#### Defined in

[packages/framework/esm-react-utils/src/useAssignedExtensionIds.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAssignedExtensionIds.ts#L13)

___

### useAssignedExtensions

▸ **useAssignedExtensions**(`slotName`): [`AssignedExtension`](interfaces/AssignedExtension.md)[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` |  |

#### Returns

[`AssignedExtension`](interfaces/AssignedExtension.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useAssignedExtensions.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAssignedExtensions.ts#L15)

___

### useConnectedExtensions

▸ **useConnectedExtensions**(`slotName`): [`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` |  |

#### Returns

[`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useConnectedExtensions.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useConnectedExtensions.ts#L15)

___

### useExtensionSlotMeta

▸ **useExtensionSlotMeta**<`T`\>(`extensionSlotName`): `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`ExtensionMeta`](interfaces/ExtensionMeta.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionSlotName` | `string` |  |

#### Returns

`Object`

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionSlotMeta.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useExtensionSlotMeta.ts#L10)

___

### useExtensionStore

▸ **useExtensionStore**(): `T`

#### Returns

`T`

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useExtensionStore.ts#L5)

▸ **useExtensionStore**(`actions`): `T` & [`BoundActions`](API.md#boundactions)

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | [`Actions`](API.md#actions) |

#### Returns

`T` & [`BoundActions`](API.md#boundactions)

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useExtensionStore.ts#L5)

▸ **useExtensionStore**(`actions?`): `T` & [`BoundActions`](API.md#boundactions)

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions?` | [`Actions`](API.md#actions) |

#### Returns

`T` & [`BoundActions`](API.md#boundactions)

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useExtensionStore.ts#L5)

___

## Framework Functions

### getAsyncExtensionLifecycle

▸ **getAsyncExtensionLifecycle**<`T`\>(`lazy`, `options`): () => `Promise`<`ReactAppOrParcel`<`any`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `lazy` | () => `Promise`<{ `default`: `ComponentType`<`T`\>  }\> |
| `options` | `ComponentDecoratorOptions` |

#### Returns

`fn`

▸ (): `Promise`<`ReactAppOrParcel`<`any`\>\>

##### Returns

`Promise`<`ReactAppOrParcel`<`any`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/getLifecycle.ts#L39)

___

### getAsyncLifecycle

▸ **getAsyncLifecycle**<`T`\>(`lazy`, `options`): () => `Promise`<`ReactAppOrParcel`<`any`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `lazy` | () => `Promise`<{ `default`: `ComponentType`<`T`\>  }\> |
| `options` | `ComponentDecoratorOptions` |

#### Returns

`fn`

▸ (): `Promise`<`ReactAppOrParcel`<`any`\>\>

##### Returns

`Promise`<`ReactAppOrParcel`<`any`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/getLifecycle.ts#L21)

___

### getLifecycle

▸ **getLifecycle**<`T`\>(`Component`, `options`): `ReactAppOrParcel`<`any`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `Component` | `ComponentType`<`T`\> |
| `options` | `ComponentDecoratorOptions` |

#### Returns

`ReactAppOrParcel`<`any`\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/getLifecycle.ts#L10)

___

### getSyncLifecycle

▸ **getSyncLifecycle**<`T`\>(`Component`, `options`): () => `Promise`<`ReactAppOrParcel`<`any`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `Component` | `ComponentType`<`T`\> |
| `options` | `ComponentDecoratorOptions` |

#### Returns

`fn`

▸ (): `Promise`<`ReactAppOrParcel`<`any`\>\>

##### Returns

`Promise`<`ReactAppOrParcel`<`any`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/getLifecycle.ts#L29)

___

## Navigation Functions

### ConfigurableLink

▸ **ConfigurableLink**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ConfigurableLinkProps`](interfaces/ConfigurableLinkProps.md) |

#### Returns

`Element`

#### Defined in

[packages/framework/esm-react-utils/src/ConfigurableLink.tsx:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ConfigurableLink.tsx#L38)

___

### interpolateString

▸ **interpolateString**(`template`, `params`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | `string` |  |
| `params` | `Object` |  |

#### Returns

`string`

#### Defined in

[packages/framework/esm-config/src/navigation/interpolate-string.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/navigation/interpolate-string.ts#L63)

___

### interpolateUrl

▸ **interpolateUrl**(`template`, `additionalParams?`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | `string` |  |
| `additionalParams?` | `Object` |  |

#### Returns

`string`

#### Defined in

[packages/framework/esm-config/src/navigation/interpolate-string.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/navigation/interpolate-string.ts#L36)

___

### navigate

▸ **navigate**(`to`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `to` | [`NavigateOptions`](interfaces/NavigateOptions.md) |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/navigation/navigate.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/navigation/navigate.ts#L42)

___

## Offline Functions

### beginEditSynchronizationItem

▸ **beginEditSynchronizationItem**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:357](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L357)

___

### canBeginEditSynchronizationItemsOfType

▸ **canBeginEditSynchronizationItemsOfType**(`type`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:347](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L347)

___

### deleteSynchronizationItem

▸ **deleteSynchronizationItem**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:377](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L377)

___

### generateOfflineUuid

▸ **generateOfflineUuid**(): `string`

#### Returns

`string`

#### Defined in

[packages/framework/esm-offline/src/uuid.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/uuid.ts#L7)

___

### getCurrentOfflineMode

▸ **getCurrentOfflineMode**(): [`OfflineModeResult`](interfaces/OfflineModeResult.md)

#### Returns

[`OfflineModeResult`](interfaces/OfflineModeResult.md)

#### Defined in

[packages/framework/esm-offline/src/mode.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/mode.ts#L49)

___

### getDynamicOfflineDataEntries

▸ **getDynamicOfflineDataEntries**(`type?`): `Promise`<[`DynamicOfflineData`](interfaces/DynamicOfflineData.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type?` | `string` |  |

#### Returns

`Promise`<[`DynamicOfflineData`](interfaces/DynamicOfflineData.md)[]\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:131](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L131)

___

### getDynamicOfflineDataEntriesFor

▸ **getDynamicOfflineDataEntriesFor**(`userId`, `type?`): `Promise`<[`DynamicOfflineData`](interfaces/DynamicOfflineData.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |
| `type?` | `string` |  |

#### Returns

`Promise`<[`DynamicOfflineData`](interfaces/DynamicOfflineData.md)[]\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:144](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L144)

___

### getDynamicOfflineDataHandlers

▸ **getDynamicOfflineDataHandlers**(): [`DynamicOfflineDataHandler`](interfaces/DynamicOfflineDataHandler.md)[]

#### Returns

[`DynamicOfflineDataHandler`](interfaces/DynamicOfflineDataHandler.md)[]

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:105](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L105)

___

### getFullSynchronizationItems

▸ **getFullSynchronizationItems**<`T`\>(`type?`): `Promise`<[`SyncItem`](interfaces/SyncItem.md)<`T`\>[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type?` | `string` |  |

#### Returns

`Promise`<[`SyncItem`](interfaces/SyncItem.md)<`T`\>[]\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:325](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L325)

___

### getFullSynchronizationItemsFor

▸ **getFullSynchronizationItemsFor**<`T`\>(`userId`, `type?`): `Promise`<[`SyncItem`](interfaces/SyncItem.md)<`T`\>[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |
| `type?` | `string` |  |

#### Returns

`Promise`<[`SyncItem`](interfaces/SyncItem.md)<`T`\>[]\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:301](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L301)

___

### getOfflinePatientDataStore

▸ **getOfflinePatientDataStore**(): `Store`<[`OfflinePatientDataSyncStore`](interfaces/OfflinePatientDataSyncStore.md)\>

#### Returns

`Store`<[`OfflinePatientDataSyncStore`](interfaces/OfflinePatientDataSyncStore.md)\>

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L45)

___

### getSynchronizationItem

▸ **getSynchronizationItem**<`T`\>(`id`): `Promise`<[`SyncItem`](interfaces/SyncItem.md)<`T`\> \| `undefined`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` |  |

#### Returns

`Promise`<[`SyncItem`](interfaces/SyncItem.md)<`T`\> \| `undefined`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:334](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L334)

___

### getSynchronizationItems

▸ **getSynchronizationItems**<`T`\>(`type?`): `Promise`<`T`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type?` | `string` |  |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:316](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L316)

___

### isOfflineUuid

▸ **isOfflineUuid**(`uuid`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-offline/src/uuid.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/uuid.ts#L12)

___

### messageOmrsServiceWorker

▸ **messageOmrsServiceWorker**(`message`): `Promise`<[`MessageServiceWorkerResult`](interfaces/MessageServiceWorkerResult.md)<`any`\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`KnownOmrsServiceWorkerMessages`](API.md#knownomrsserviceworkermessages) |  |

#### Returns

`Promise`<[`MessageServiceWorkerResult`](interfaces/MessageServiceWorkerResult.md)<`any`\>\>

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L11)

___

### putDynamicOfflineData

▸ **putDynamicOfflineData**(`type`, `identifier`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |
| `identifier` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:162](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L162)

___

### putDynamicOfflineDataFor

▸ **putDynamicOfflineDataFor**(`userId`, `type`, `identifier`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |
| `type` | `string` |  |
| `identifier` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:177](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L177)

___

### queueSynchronizationItem

▸ **queueSynchronizationItem**<`T`\>(`type`, `content`, `descriptor?`): `Promise`<`number`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |
| `content` | `T` |  |
| `descriptor?` | [`QueueItemDescriptor`](interfaces/QueueItemDescriptor.md) |  |

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:274](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L274)

___

### registerOfflinePatientHandler

▸ **registerOfflinePatientHandler**(`identifier`, `handler`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier` | `string` |
| `handler` | [`OfflinePatientDataSyncHandler`](interfaces/OfflinePatientDataSyncHandler.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:51](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L51)

___

### removeDynamicOfflineData

▸ **removeDynamicOfflineData**(`type`, `identifier`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |
| `identifier` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:213](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L213)

___

### removeDynamicOfflineDataFor

▸ **removeDynamicOfflineDataFor**(`userId`, `type`, `identifier`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |
| `type` | `string` |  |
| `identifier` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:228](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L228)

___

### setupDynamicOfflineDataHandler

▸ **setupDynamicOfflineDataHandler**(`handler`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | [`DynamicOfflineDataHandler`](interfaces/DynamicOfflineDataHandler.md) |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:114](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L114)

___

### setupOfflineSync

▸ **setupOfflineSync**<`T`\>(`type`, `dependsOn`, `process`, `options?`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |
| `dependsOn` | `string`[] |  |
| `process` | `ProcessSyncItem`<`T`\> |  |
| `options` | `SetupOfflineSyncOptions`<`T`\> |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:392](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L392)

___

### subscribeConnectivity

▸ **subscribeConnectivity**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [`ConnectivityChangedEvent`](interfaces/ConnectivityChangedEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L24)

___

### subscribeConnectivityChanged

▸ **subscribeConnectivityChanged**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [`ConnectivityChangedEvent`](interfaces/ConnectivityChangedEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L14)

___

### subscribePrecacheStaticDependencies

▸ **subscribePrecacheStaticDependencies**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [`PrecacheStaticDependenciesEvent`](interfaces/PrecacheStaticDependenciesEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L45)

___

### syncAllDynamicOfflineData

▸ **syncAllDynamicOfflineData**(`type`, `abortSignal?`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |
| `abortSignal?` | `AbortSignal` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:262](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L262)

___

### syncDynamicOfflineData

▸ **syncDynamicOfflineData**(`type`, `identifier`, `abortSignal?`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |
| `identifier` | `string` |  |
| `abortSignal?` | `AbortSignal` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:280](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L280)

___

### syncOfflinePatientData

▸ **syncOfflinePatientData**(`patientUuid`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L71)

___

### useConnectivity

▸ **useConnectivity**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-react-utils/src/useConnectivity.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useConnectivity.ts#L5)

___

## Other Functions

### ExtensionSlot

▸ **ExtensionSlot**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ExtensionSlotProps`](API.md#extensionslotprops) |

#### Returns

`Element`

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:85](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L85)

___

## Store Functions

### createGlobalStore

▸ **createGlobalStore**<`TState`\>(`name`, `initialState`): `Store`<`TState`\>

#### Type parameters

| Name |
| :------ |
| `TState` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` |  |
| `initialState` | `TState` |  |

#### Returns

`Store`<`TState`\>

#### Defined in

[packages/framework/esm-state/src/state.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L19)

___

### createUseStore

▸ **createUseStore**<`T`\>(`store`): () => `T`(`actions`: [`Actions`](API.md#actions)) => `T` & [`BoundActions`](API.md#boundactions)(`actions?`: [`Actions`](API.md#actions)) => `T` & [`BoundActions`](API.md#boundactions)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<`T`\> |

#### Returns

`fn`

▸ (): `T`

##### Returns

`T`

▸ (`actions`): `T` & [`BoundActions`](API.md#boundactions)

##### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | [`Actions`](API.md#actions) |

##### Returns

`T` & [`BoundActions`](API.md#boundactions)

▸ (`actions?`): `T` & [`BoundActions`](API.md#boundactions)

##### Parameters

| Name | Type |
| :------ | :------ |
| `actions?` | [`Actions`](API.md#actions) |

##### Returns

`T` & [`BoundActions`](API.md#boundactions)

#### Defined in

[packages/framework/esm-react-utils/src/createUseStore.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/createUseStore.ts#L23)

___

### getAppState

▸ **getAppState**(): `Store`<[`AppState`](interfaces/AppState.md)\>

#### Returns

`Store`<[`AppState`](interfaces/AppState.md)\>

#### Defined in

[packages/framework/esm-state/src/state.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L86)

___

### getGlobalStore

▸ **getGlobalStore**<`TState`\>(`name`, `fallbackState?`): `Store`<`TState`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TState` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` |  |
| `fallbackState?` | `TState` |  |

#### Returns

`Store`<`TState`\>

#### Defined in

[packages/framework/esm-state/src/state.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L56)

___

### subscribeTo

▸ **subscribeTo**<`T`, `U`\>(`store`, `select`, `handle`): `Unsubscribe`

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<`T`\> |
| `select` | (`state`: `T`) => `U` |
| `handle` | (`subState`: `U`) => `void` |

#### Returns

`Unsubscribe`

#### Defined in

[packages/framework/esm-state/src/state.ts:90](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L90)

___

### useStore

▸ **useStore**<`T`, `U`\>(`store`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<`T`\> |

#### Returns

`T`

#### Defined in

[packages/framework/esm-react-utils/src/useStore.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L23)

▸ **useStore**<`T`, `U`\>(`store`, `select`): `U`

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<`T`\> |
| `select` | (`state`: `T`) => `U` |

#### Returns

`U`

#### Defined in

[packages/framework/esm-react-utils/src/useStore.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L24)

▸ **useStore**<`T`, `U`\>(`store`, `select`, `actions`): `T` & [`BoundActions`](API.md#boundactions)

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<`T`\> |
| `select` | `undefined` |
| `actions` | [`Actions`](API.md#actions) |

#### Returns

`T` & [`BoundActions`](API.md#boundactions)

#### Defined in

[packages/framework/esm-react-utils/src/useStore.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L25)

▸ **useStore**<`T`, `U`\>(`store`, `select`, `actions`): `U` & [`BoundActions`](API.md#boundactions)

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<`T`\> |
| `select` | (`state`: `T`) => `U` |
| `actions` | [`Actions`](API.md#actions) |

#### Returns

`U` & [`BoundActions`](API.md#boundactions)

#### Defined in

[packages/framework/esm-react-utils/src/useStore.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L30)

___

### useStoreWithActions

▸ **useStoreWithActions**<`T`\>(`store`, `actions`): `T` & [`BoundActions`](API.md#boundactions)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<`T`\> |
| `actions` | [`Actions`](API.md#actions) |

#### Returns

`T` & [`BoundActions`](API.md#boundactions)

#### Defined in

[packages/framework/esm-react-utils/src/useStore.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L52)

___

## UI Functions

### isDesktop

▸ **isDesktop**(`layout`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `layout` | [`LayoutType`](API.md#layouttype) |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-react-utils/src/useLayoutType.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useLayoutType.ts#L40)

___

### setLeftNav

▸ **setLeftNav**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/left-nav/index.tsx:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/left-nav/index.tsx#L18)

___

### showModal

▸ **showModal**(`extensionId`, `props?`, `onClose?`): () => `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionId` | `string` |  |
| `props` | `Record`<`string`, `any`\> |  |
| `onClose` | () => `void` |  |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/modals/index.tsx:165](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/modals/index.tsx#L165)

___

### showNotification

▸ **showNotification**(`notification`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `notification` | [`NotificationDescriptor`](interfaces/NotificationDescriptor.md) |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/notifications/index.tsx:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/notifications/index.tsx#L40)

___

### showToast

▸ **showToast**(`toast`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `toast` | [`ToastDescriptor`](interfaces/ToastDescriptor.md) |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/toasts/index.tsx:36](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/toasts/index.tsx#L36)

___

### subscribeNotificationShown

▸ **subscribeNotificationShown**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [`ShowNotificationEvent`](interfaces/ShowNotificationEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L93)

___

### subscribeToastShown

▸ **subscribeToastShown**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [`ShowToastEvent`](interfaces/ShowToastEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:102](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/events.ts#L102)

___

### unsetLeftNav

▸ **unsetLeftNav**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/left-nav/index.tsx:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/left-nav/index.tsx#L22)

___

### useBodyScrollLock

▸ **useBodyScrollLock**(`active`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `active` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-react-utils/src/useBodyScrollLock.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useBodyScrollLock.ts#L4)

___

### useLayoutType

▸ **useLayoutType**(): [`LayoutType`](API.md#layouttype)

#### Returns

[`LayoutType`](API.md#layouttype)

#### Defined in

[packages/framework/esm-react-utils/src/useLayoutType.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useLayoutType.ts#L26)

___

### useOnClickOutside

▸ **useOnClickOutside**<`T`\>(`handler`, `active?`): `RefObject`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `HTMLElement` = `HTMLElement` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `handler` | (`event`: `Event`) => `void` | `undefined` |
| `active` | `boolean` | `true` |

#### Returns

`RefObject`<`T`\>

#### Defined in

[packages/framework/esm-react-utils/src/useOnClickOutside.tsx:4](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOnClickOutside.tsx#L4)

___

### usePagination

▸ **usePagination**<`T`\>(`data?`, `resultsPerPage?`): `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `T`[] | `[]` |
| `resultsPerPage` | `number` | `defaultResultsPerPage` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `currentPage` | `number` |
| `paginated` | `boolean` |
| `results` | `T`[] |
| `showNextButton` | `boolean` |
| `showPreviousButton` | `boolean` |
| `totalPages` | `number` |
| `goTo` | (`page`: `number`) => `void` |
| `goToNext` | () => `void` |
| `goToPrevious` | () => `void` |

#### Defined in

[packages/framework/esm-react-utils/src/usePagination.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/usePagination.ts#L6)

___

## Utility Functions

### age

▸ **age**(`dateString`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dateString` | `string` |  |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/age-helpers.tsx:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/age-helpers.tsx#L39)

___

### daysIntoYear

▸ **daysIntoYear**(`date`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` |  |

#### Returns

`number`

#### Defined in

[packages/framework/esm-utils/src/age-helpers.tsx:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/age-helpers.tsx#L8)

___

### isSameDay

▸ **isSameDay**(`firstDate`, `secondDate`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `firstDate` | `Date` |  |
| `secondDate` | `Date` |  |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-utils/src/age-helpers.tsx:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/age-helpers.tsx#L25)

___

### isVersionSatisfied

▸ **isVersionSatisfied**(`requiredVersion`, `installedVersion`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `requiredVersion` | `string` |
| `installedVersion` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-utils/src/version.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/version.ts#L22)

___

### retry

▸ **retry**<`T`\>(`fn`, `options?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => `Promise`<`T`\> |  |
| `options` | [`RetryOptions`](interfaces/RetryOptions.md) |  |

#### Returns

`Promise`<`T`\>

#### Defined in

[packages/framework/esm-utils/src/retry.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/retry.ts#L40)

___

### translateFrom

▸ **translateFrom**(`moduleName`, `key`, `fallback?`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |
| `key` | `string` |
| `fallback?` | `string` |
| `options?` | `object` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/translate.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/translate.ts#L4)
