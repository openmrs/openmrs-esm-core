[Back to README.md](../README.md)

# @openmrs/esm-framework

## Table of contents

### API Functions

- [fetchCurrentPatient](API.md#fetchcurrentpatient)
- [getCurrentUser](API.md#getcurrentuser)
- [getLocations](API.md#getlocations)
- [getLoggedInUser](API.md#getloggedinuser)
- [getSessionLocation](API.md#getsessionlocation)
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
- [userHasAccess](API.md#userhasaccess)

### Breadcrumb Functions

- [filterBreadcrumbs](API.md#filterbreadcrumbs)
- [getBreadcrumbs](API.md#getbreadcrumbs)
- [getBreadcrumbsFor](API.md#getbreadcrumbsfor)
- [registerBreadcrumb](API.md#registerbreadcrumb)
- [registerBreadcrumbs](API.md#registerbreadcrumbs)

### Date and time Functions

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

### Navigation Functions

- [interpolateString](API.md#interpolatestring)
- [interpolateUrl](API.md#interpolateurl)
- [isUrl](API.md#isurl)
- [isUrlWithTemplateParameters](API.md#isurlwithtemplateparameters)
- [navigate](API.md#navigate)

### Other Functions

- [activateOfflineCapability](API.md#activateofflinecapability)
- [age](API.md#age)
- [attach](API.md#attach)
- [beginEditSynchronizationItem](API.md#begineditsynchronizationitem)
- [canBeginEditSynchronizationItemsOfType](API.md#canbegineditsynchronizationitemsoftype)
- [checkStatus](API.md#checkstatus)
- [checkStatusFor](API.md#checkstatusfor)
- [createErrorHandler](API.md#createerrorhandler)
- [createGlobalStore](API.md#createglobalstore)
- [createUseStore](API.md#createusestore)
- [daysIntoYear](API.md#daysintoyear)
- [defineConfigSchema](API.md#defineconfigschema)
- [deleteSynchronizationItem](API.md#deletesynchronizationitem)
- [detach](API.md#detach)
- [detachAll](API.md#detachall)
- [dispatchConnectivityChanged](API.md#dispatchconnectivitychanged)
- [dispatchNetworkRequestFailed](API.md#dispatchnetworkrequestfailed)
- [dispatchNotificationShown](API.md#dispatchnotificationshown)
- [dispatchPrecacheStaticDependencies](API.md#dispatchprecachestaticdependencies)
- [generateOfflineUuid](API.md#generateofflineuuid)
- [getAppState](API.md#getappstate)
- [getAssignedExtensions](API.md#getassignedextensions)
- [getAsyncExtensionLifecycle](API.md#getasyncextensionlifecycle)
- [getAsyncLifecycle](API.md#getasynclifecycle)
- [getConfig](API.md#getconfig)
- [getConnectedExtensions](API.md#getconnectedextensions)
- [getCurrentOfflineMode](API.md#getcurrentofflinemode)
- [getCustomProps](API.md#getcustomprops)
- [getExtensionNameFromId](API.md#getextensionnamefromid)
- [getExtensionRegistration](API.md#getextensionregistration)
- [getExtensionRegistrationFrom](API.md#getextensionregistrationfrom)
- [getExtensionStore](API.md#getextensionstore)
- [getGlobalStore](API.md#getglobalstore)
- [getLifecycle](API.md#getlifecycle)
- [getOfflinePatientDataStore](API.md#getofflinepatientdatastore)
- [getOfflineSynchronizationStore](API.md#getofflinesynchronizationstore)
- [getOmrsServiceWorker](API.md#getomrsserviceworker)
- [getSyncLifecycle](API.md#getsynclifecycle)
- [getSynchronizationItem](API.md#getsynchronizationitem)
- [getSynchronizationItems](API.md#getsynchronizationitems)
- [getSynchronizationItemsFor](API.md#getsynchronizationitemsfor)
- [handleApiError](API.md#handleapierror)
- [inRange](API.md#inrange)
- [integrateBreakpoints](API.md#integratebreakpoints)
- [isOfflineUuid](API.md#isofflineuuid)
- [isSameDay](API.md#issameday)
- [isVersionSatisfied](API.md#isversionsatisfied)
- [loadPersistedPatientDataSyncState](API.md#loadpersistedpatientdatasyncstate)
- [messageOmrsServiceWorker](API.md#messageomrsserviceworker)
- [openmrsComponentDecorator](API.md#openmrscomponentdecorator)
- [patchXMLHttpRequest](API.md#patchxmlhttprequest)
- [processConfig](API.md#processconfig)
- [provide](API.md#provide)
- [pushNavigationContext](API.md#pushnavigationcontext)
- [queueSynchronizationItem](API.md#queuesynchronizationitem)
- [queueSynchronizationItemFor](API.md#queuesynchronizationitemfor)
- [registerOfflinePatientHandler](API.md#registerofflinepatienthandler)
- [registerOmrsServiceWorker](API.md#registeromrsserviceworker)
- [renderExtension](API.md#renderextension)
- [renderInlineNotifications](API.md#renderinlinenotifications)
- [renderLoadingSpinner](API.md#renderloadingspinner)
- [renderModals](API.md#rendermodals)
- [renderToasts](API.md#rendertoasts)
- [reportError](API.md#reporterror)
- [retry](API.md#retry)
- [runSynchronization](API.md#runsynchronization)
- [setCurrentOfflineMode](API.md#setcurrentofflinemode)
- [setupOfflineSync](API.md#setupofflinesync)
- [setupPaths](API.md#setuppaths)
- [setupUtils](API.md#setuputils)
- [showModal](API.md#showmodal)
- [showNotification](API.md#shownotification)
- [showToast](API.md#showtoast)
- [subscribeConnectivity](API.md#subscribeconnectivity)
- [subscribeConnectivityChanged](API.md#subscribeconnectivitychanged)
- [subscribeNetworkRequestFailed](API.md#subscribenetworkrequestfailed)
- [subscribeNotificationShown](API.md#subscribenotificationshown)
- [subscribePrecacheStaticDependencies](API.md#subscribeprecachestaticdependencies)
- [subscribeTo](API.md#subscribeto)
- [subscribeToastShown](API.md#subscribetoastshown)
- [switchTo](API.md#switchto)
- [syncOfflinePatientData](API.md#syncofflinepatientdata)
- [translateFrom](API.md#translatefrom)
- [update](API.md#update)
- [useAssignedExtensionIds](API.md#useassignedextensionids)
- [useAssignedExtensions](API.md#useassignedextensions)
- [useBodyScrollLock](API.md#usebodyscrolllock)
- [useConfig](API.md#useconfig)
- [useConnectedExtensions](API.md#useconnectedextensions)
- [useConnectivity](API.md#useconnectivity)
- [useCurrentPatient](API.md#usecurrentpatient)
- [useExtensionSlotMeta](API.md#useextensionslotmeta)
- [useExtensionStore](API.md#useextensionstore)
- [useForceUpdate](API.md#useforceupdate)
- [useLayoutType](API.md#uselayouttype)
- [useLocations](API.md#uselocations)
- [useNavigationContext](API.md#usenavigationcontext)
- [useOnClickOutside](API.md#useonclickoutside)
- [usePagination](API.md#usepagination)
- [usePatient](API.md#usepatient)
- [useSessionUser](API.md#usesessionuser)
- [useStore](API.md#usestore)
- [useStoreState](API.md#usestorestate)
- [useVisit](API.md#usevisit)
- [useVisitTypes](API.md#usevisittypes)
- [validator](API.md#validator)

## API Type aliases

### CurrentPatient

Ƭ **CurrentPatient**: `fhir.Patient` \| [`FetchResponse`](interfaces/FetchResponse.md)<`fhir.Patient`\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L9)

___

### PatientUuid

Ƭ **PatientUuid**: `string` \| ``null``

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L23)

___

## Date and time Type aliases

### DateInput

Ƭ **DateInput**: `string` \| `number` \| `Date`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L19)

___

### FormatDateMode

Ƭ **FormatDateMode**: ``"standard"`` \| ``"wide"``

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:140](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L140)

___

### FormatDateOptions

Ƭ **FormatDateOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `day` | `boolean` | Whether to include the day number |
| `mode` | [`FormatDateMode`](API.md#formatdatemode) | - `standard`: "03 Feb 2022" - `wide`:     "03 — Feb — 2022" |
| `time` | `boolean` \| ``"for today"`` | Whether the time should be included in the output always (`true`), never (`false`), or only when the input date is today (`for today`). |
| `year` | `boolean` | Whether to include the year |

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:142](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L142)

___

## Other Type aliases

### Actions

Ƭ **Actions**: `Function` \| { `[key: string]`: `Function`;  }

#### Defined in

[packages/framework/esm-react-utils/src/createUseStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/createUseStore.ts#L4)

___

### BoundActions

Ƭ **BoundActions**: `Object`

#### Index signature

▪ [key: `string`]: `BoundAction`

#### Defined in

[packages/framework/esm-react-utils/src/createUseStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/createUseStore.ts#L5)

___

### ConfigValue

Ƭ **ConfigValue**: `string` \| `number` \| `boolean` \| `void` \| `any`[] \| `object`

#### Defined in

[packages/framework/esm-config/src/types.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L31)

___

### ExtensionSlotProps

Ƭ **ExtensionSlotProps**: [`ExtensionSlotBaseProps`](interfaces/ExtensionSlotBaseProps.md) & `React.HTMLAttributes`<`HTMLDivElement`\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:48](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L48)

___

### KnownOmrsServiceWorkerEvents

Ƭ **KnownOmrsServiceWorkerEvents**: [`NetworkRequestFailedEvent`](interfaces/NetworkRequestFailedEvent.md)

#### Defined in

[packages/framework/esm-offline/src/service-worker-events.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L15)

___

### KnownOmrsServiceWorkerMessages

Ƭ **KnownOmrsServiceWorkerMessages**: [`OnImportMapChangedMessage`](interfaces/OnImportMapChangedMessage.md) \| [`ClearDynamicRoutesMessage`](interfaces/ClearDynamicRoutesMessage.md) \| [`RegisterDynamicRouteMessage`](interfaces/RegisterDynamicRouteMessage.md)

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L45)

___

### LayoutType

Ƭ **LayoutType**: ``"tablet"`` \| ``"phone"`` \| ``"desktop"``

#### Defined in

[packages/framework/esm-react-utils/src/useLayoutType.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useLayoutType.ts#L3)

___

### LoggedInUserData

Ƭ **LoggedInUserData**: [`UnauthenticatedUser`](interfaces/UnauthenticatedUser.md) & { `user?`: [`LoggedInUser`](interfaces/LoggedInUser.md)  }

#### Defined in

[packages/framework/esm-api/src/types/fetch.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/fetch.ts#L7)

___

### NavigationContextType

Ƭ **NavigationContextType**: ``"workspace"`` \| ``"dialog"`` \| ``"link"``

#### Defined in

[packages/framework/esm-extensions/src/contexts.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L3)

___

### OfflineMode

Ƭ **OfflineMode**: ``"on"`` \| ``"off"`` \| ``"unavailable"``

#### Defined in

[packages/framework/esm-offline/src/mode.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/mode.ts#L36)

___

### OmrsOfflineCachingStrategy

Ƭ **OmrsOfflineCachingStrategy**: ``"network-only-or-cache-only"`` \| ``"network-first"``

* `cache-or-network`: The default strategy, equal to the absence of this header.
  The SW attempts to resolve the request via the network, but falls back to the cache if required.
  The service worker decides the strategy to be used.
* `network-first`: See https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_first_network_falling_back_to_cache.

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L16)

___

### OmrsOfflineHttpHeaderNames

Ƭ **OmrsOfflineHttpHeaderNames**: keyof [`OmrsOfflineHttpHeaders`](API.md#omrsofflinehttpheaders)

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L43)

___

### OmrsOfflineHttpHeaders

Ƭ **OmrsOfflineHttpHeaders**: `Object`

Defines the keys of the custom headers which can be appended to an HTTP request.
HTTP requests with these headers are handled in a special way by the SPA's service worker.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `x-omrs-offline-caching-strategy?` | [`OmrsOfflineCachingStrategy`](API.md#omrsofflinecachingstrategy) | Instructs the service worker to use a specific caching strategy for this request. |
| `x-omrs-offline-response-body?` | `string` | If the client is offline and the request cannot be read from the cache (i.e. if there is no way to receive any kind of data for this request), the service worker will return a response with the body in this header. |
| `x-omrs-offline-response-status?` | \`${number}\` | If the client is offline and the request cannot be read from the cache (i.e. if there is no way to receive any kind of data for this request), the service worker will return a response with the status code defined in this header. |

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L24)

___

### ProcessSyncItem

Ƭ **ProcessSyncItem**<`T`\>: (`item`: `T`, `options`: [`SyncProcessOptions`](interfaces/SyncProcessOptions.md)<`T`\>) => `Promise`<`any`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`item`, `options`): `Promise`<`any`\>

A function which, when invoked, performs the actual client-server synchronization of the given
`item` (which is the actual data to be synchronized).
The function receives additional `options` which provide additional data that can be used
for synchronizing.

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |
| `options` | [`SyncProcessOptions`](interfaces/SyncProcessOptions.md)<`T`\> |

##### Returns

`Promise`<`any`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L45)

___

### ProvidedConfig

Ƭ **ProvidedConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](interfaces/Config.md) |
| `source` | `string` |

#### Defined in

[packages/framework/esm-config/src/types.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L59)

___

### SpaEnvironment

Ƭ **SpaEnvironment**: ``"production"`` \| ``"development"`` \| ``"test"``

#### Defined in

[packages/framework/esm-globals/src/types.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L55)

___

### UpdateVisitPayload

Ƭ **UpdateVisitPayload**: [`NewVisitPayload`](interfaces/NewVisitPayload.md) & {}

#### Defined in

[packages/framework/esm-api/src/types/visit-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/visit-resource.ts#L12)

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

[packages/framework/esm-config/src/types.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L66)

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

[packages/framework/esm-config/src/types.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L64)

## API Variables

### fhir

• **fhir**: `FhirClient`

The `fhir` object is [an instance of fhir.js](https://github.com/FHIR/fhir.js)
that can be used to call FHIR-compliant OpenMRS APIs. See
[the docs for fhir.js](https://github.com/FHIR/fhir.js) for more info
and example usage.

#### Defined in

[packages/framework/esm-api/src/fhir.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/fhir.ts#L45)

___

### fhirBaseUrl

• **fhirBaseUrl**: ``"/ws/fhir2/R4"``

#### Defined in

[packages/framework/esm-api/src/fhir.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/fhir.ts#L8)

___

### getStartedVisit

• **getStartedVisit**: `BehaviorSubject`<``null`` \| [`VisitItem`](interfaces/VisitItem.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:77](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L77)

___

### sessionEndpoint

• **sessionEndpoint**: ``"/ws/rest/v1/session"``

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L11)

___

## Navigation Variables

### ConfigurableLink

• **ConfigurableLink**: `React.FC`<[`ConfigurableLinkProps`](interfaces/ConfigurableLinkProps.md)\>

A React link component which calls [navigate](API.md#navigate) when clicked

**`param`** The target path or URL. Supports interpolation. See [navigate](API.md#navigate)

**`param`** Inline elements within the link

**`param`** Any other valid props for an <a> tag except `href` and `onClick`

#### Defined in

[packages/framework/esm-react-utils/src/ConfigurableLink.tsx:32](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ConfigurableLink.tsx#L32)

___

## Other Variables

### ComponentContext

• **ComponentContext**: `Context`<[`ComponentConfig`](interfaces/ComponentConfig.md)\>

Available to all components. Provided by `openmrsComponentDecorator`.

#### Defined in

[packages/framework/esm-react-utils/src/ComponentContext.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ComponentContext.ts#L17)

___

### Extension

• **Extension**: `React.FC`<[`ExtensionProps`](interfaces/ExtensionProps.md)\>

Represents the position in the DOM where each extension within
an extension slot is rendered.

Renders once for each extension attached to that extension slot.

Usage of this component *must* have an ancestor `<ExtensionSlot>`,
and *must* only be used once within that `<ExtensionSlot>`.

#### Defined in

[packages/framework/esm-react-utils/src/Extension.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/Extension.tsx#L23)

___

### ExtensionSlot

• **ExtensionSlot**: `React.FC`<[`ExtensionSlotProps`](API.md#extensionslotprops)\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L55)

___

### UserHasAccess

• **UserHasAccess**: `React.FC`<[`UserHasAccessProps`](interfaces/UserHasAccessProps.md)\>

#### Defined in

[packages/framework/esm-react-utils/src/UserHasAccess.tsx:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/UserHasAccess.tsx#L8)

___

### backendDependencies

• **backendDependencies**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fhir2` | `string` |
| `webservices.rest` | `string` |

#### Defined in

[packages/framework/esm-api/src/openmrs-backend-dependencies.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-backend-dependencies.ts#L1)

___

### extensionStore

• **extensionStore**: `Store`<[`ExtensionInternalStore`](interfaces/ExtensionInternalStore.md)\>

**`deprecated`** Use `getExtensionStore`. The structure of this store has also changed.

#### Defined in

[packages/framework/esm-extensions/src/index.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/index.ts#L12)

___

### offlineUuidPrefix

• **offlineUuidPrefix**: ``"OFFLINE+"``

#### Defined in

[packages/framework/esm-offline/src/uuid.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/uuid.ts#L3)

___

### omrsOfflineCachingStrategyHttpHeaderName

• **omrsOfflineCachingStrategyHttpHeaderName**: ``"x-omrs-offline-caching-strategy"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L5)

___

### omrsOfflineResponseBodyHttpHeaderName

• **omrsOfflineResponseBodyHttpHeaderName**: ``"x-omrs-offline-response-body"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L1)

___

### omrsOfflineResponseStatusHttpHeaderName

• **omrsOfflineResponseStatusHttpHeaderName**: ``"x-omrs-offline-response-status"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L3)

___

### validators

• **validators**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inRange` | (`min`: `number`, `max`: `number`) => [`Validator`](API.md#validator) |
| `isUrl` | [`Validator`](API.md#validator) |
| `isUrlWithTemplateParameters` | (`allowedTemplateParameters`: `string`[]) => [`Validator`](API.md#validator) |

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L57)

## API Functions

### fetchCurrentPatient

▸ **fetchCurrentPatient**(`patientUuid`, `contentOverrides?`): `Promise`<{ `data`: `Patient`  }\> \| `Promise`<``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | [`PatientUuid`](API.md#patientuuid) |
| `contentOverrides?` | `Partial`<{ `headers?`: [`FetchHeaders`](interfaces/FetchHeaders.md) ; `id?`: `string` ; `patient?`: `string` ; `type`: `ResourceName`  }\> |

#### Returns

`Promise`<{ `data`: `Patient`  }\> \| `Promise`<``null``\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L25)

___

### getCurrentUser

▸ **getCurrentUser**(): `Observable`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

The getCurrentUser function returns an observable that produces
**zero or more values, over time**. It will produce zero values
by default if the user is not logged in. And it will provide a
first value when the logged in user is fetched from the server.
Subsequent values will be produced whenever the user object is
updated.

#### Returns

`Observable`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

An Observable that produces zero or more values (as
  described above). The values produced will be a user object (if
  `includeAuthStatus` is set to `false`) or an object with a session
  and authenticated property (if `includeAuthStatus` is set to `true`).

#### Example

```js
import { getCurrentUser } from '@openmrs/esm-api'
const subscription = getCurrentUser().subscribe(
  user => console.log(user)
)
subscription.unsubscribe()
getCurrentUser({includeAuthStatus: true}).subscribe(
  data => console.log(data.authenticated)
)
```

#### Be sure to unsubscribe when your component unmounts

Otherwise your code will continue getting updates to the user object
even after the UI component is gone from the screen. This is a memory
leak and source of bugs.

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L60)

▸ **getCurrentUser**(`opts`): `Observable`<[`UnauthenticatedUser`](interfaces/UnauthenticatedUser.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CurrentUserWithResponseOption`](interfaces/CurrentUserWithResponseOption.md) |

#### Returns

`Observable`<[`UnauthenticatedUser`](interfaces/UnauthenticatedUser.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L61)

▸ **getCurrentUser**(`opts`): `Observable`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CurrentUserWithoutResponseOption`](interfaces/CurrentUserWithoutResponseOption.md) |

#### Returns

`Observable`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L64)

___

### getLocations

▸ **getLocations**(): `Observable`<[`Location`](interfaces/Location.md)[]\>

#### Returns

`Observable`<[`Location`](interfaces/Location.md)[]\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/location.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/location.ts#L18)

___

### getLoggedInUser

▸ **getLoggedInUser**(): `Promise`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Returns

`Promise`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:135](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L135)

___

### getSessionLocation

▸ **getSessionLocation**(): `Promise`<`undefined` \| [`SessionLocation`](interfaces/SessionLocation.md)\>

#### Returns

`Promise`<`undefined` \| [`SessionLocation`](interfaces/SessionLocation.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:144](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L144)

___

### getVisitTypes

▸ **getVisitTypes**(): `Observable`<[`VisitType`](interfaces/VisitType.md)[]\>

#### Returns

`Observable`<[`VisitType`](interfaces/VisitType.md)[]\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-type.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-type.ts#L19)

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

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L16)

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

[packages/framework/esm-api/src/openmrs-fetch.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L13)

___

### openmrsFetch

▸ **openmrsFetch**<`T`\>(`path`, `fetchInit?`): `Promise`<[`FetchResponse`](interfaces/FetchResponse.md)<`T`\>\>

The openmrsFetch function is a wrapper around the
[browser's built-in fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch),
with extra handling for OpenMRS-specific API behaviors, such as
request headers, authentication, authorization, and the API urls.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | A string url to make the request to. Note that the   openmrs base url (by default `/openmrs`) will be automatically   prepended to the URL, so there is no need to include it. |
| `fetchInit` | `FetchConfig` | A [fetch init object](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax).   Note that the `body` property does not need to be `JSON.stringify()`ed   because openmrsFetch will do that for you. |

#### Returns

`Promise`<[`FetchResponse`](interfaces/FetchResponse.md)<`T`\>\>

A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  that resolves with a [Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response).
  Note that the openmrs version of the Response object has already
  downloaded the HTTP response body as json, and has an additional
  `data` property with the HTTP response json as a javascript object.

#### Example
```js
import { openmrsFetch } from '@openmrs/esm-api'
const abortController = new AbortController();
openmrsFetch('/ws/rest/v1/session', {signal: abortController.signal})
  .then(response => {
    console.log(response.data.authenticated)
  })
  .catch(err => {
    console.error(err.status);
  })
abortController.abort();
openmrsFetch('/ws/rest/v1/session', {
  method: 'POST',
  body: {
    username: 'hi',
    password: 'there',
  }
})
```

#### Cancellation

To cancel a network request, use an
[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
It is best practice to cancel your network requests when the user
navigates away from a page while the request is pending request, to
free up memory and network resources and to prevent race conditions.

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L66)

___

### openmrsObservableFetch

▸ **openmrsObservableFetch**<`T`\>(`url`, `fetchInit?`): `Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<`T`\>\>

The openmrsObservableFetch function is a wrapper around openmrsFetch
that returns an [Observable](https://rxjs-dev.firebaseapp.com/guide/observable)
instead of a promise. It exists in case using an Observable is
preferred or more convenient than a promise.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | See [openmrsFetch](API.md#openmrsfetch) |
| `fetchInit` | `FetchConfig` | See [openmrsFetch](API.md#openmrsfetch) |

#### Returns

`Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<`T`\>\>

An Observable that produces exactly one Response object.
The response object is exactly the same as for [openmrsFetch](API.md#openmrsfetch).

#### Example

```js
import { openmrsObservableFetch } from '@openmrs/esm-api'
const subscription = openmrsObservableFetch('/ws/rest/v1/session').subscribe(
  response => console.log(response.data),
  err => {throw err},
  () => console.log('finished')
)
subscription.unsubscribe()
```

#### Cancellation

To cancel the network request, simply call `subscription.unsubscribe();`

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:237](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L237)

___

### refetchCurrentUser

▸ **refetchCurrentUser**(): `void`

The `refetchCurrentUser` function causes a network request to redownload
the user. All subscribers to the current user will be notified of the
new users once the new version of the user object is downloaded.

#### Returns

`void`

The same observable as returned by [getCurrentUser](API.md#getcurrentuser).

#### Example
```js
import { refetchCurrentUser } from '@openmrs/esm-api'
refetchCurrentUser()
```

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:117](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L117)

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

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:48](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L48)

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

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:156](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L156)

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

[packages/framework/esm-api/src/shared-api-objects/location.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/location.ts#L11)

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

[packages/framework/esm-api/src/shared-api-objects/visit-type.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-type.ts#L11)

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

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L62)

___

### userHasAccess

▸ **userHasAccess**(`requiredPrivilege`, `user`): `undefined` \| [`Privilege`](interfaces/Privilege.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `requiredPrivilege` | `string` |
| `user` | [`LoggedInUser`](interfaces/LoggedInUser.md) |

#### Returns

`undefined` \| [`Privilege`](interfaces/Privilege.md)

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:131](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L131)

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

[packages/framework/esm-breadcrumbs/src/filter.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/filter.ts#L49)

___

### getBreadcrumbs

▸ **getBreadcrumbs**(): [`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[]

#### Returns

[`BreadcrumbRegistration`](interfaces/BreadcrumbRegistration.md)[]

#### Defined in

[packages/framework/esm-breadcrumbs/src/db.ts:50](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L50)

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

[packages/framework/esm-breadcrumbs/src/filter.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/filter.ts#L78)

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

[packages/framework/esm-breadcrumbs/src/db.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L26)

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

[packages/framework/esm-breadcrumbs/src/db.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L35)

___

## Date and time Functions

### formatDate

▸ **formatDate**(`date`, `options?`): `string`

Formats the input date according to the current locale and the
given options.

Default options:
 - mode: "standard",
 - time: "for today",
 - day: true,
 - year: true

If the date is today then "Today" is produced (in the locale language).

When time is included, it is appended with a comma and a space. This
agrees with the output of `Date.prototype.toLocaleString` for *most*
locales.

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `options?` | `Partial`<[`FormatDateOptions`](API.md#formatdateoptions)\> |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:182](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L182)

___

### formatDatetime

▸ **formatDatetime**(`date`, `options?`): `string`

Formats the input into a string showing the date and time, according
to the current locale. The `mode` parameter is as described for
`formatDate`.

This is created by concatenating the results of `formatDate`
and `formatTime` with a comma and space. This agrees with the
output of `Date.prototype.toLocaleString` for *most* locales.

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `options?` | `Partial`<`Omit`<[`FormatDateOptions`](API.md#formatdateoptions), ``"time"``\>\> |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:249](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L249)

___

### formatTime

▸ **formatTime**(`date`): `string`

Formats the input as a time, according to the current locale.
12-hour or 24-hour clock depends on locale.

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Date` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:233](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L233)

___

### isOmrsDateStrict

▸ **isOmrsDateStrict**(`omrsPayloadString`): `boolean`

This function is STRICT on checking whether a date string is the openmrs format.
The format should be YYYY-MM-DDTHH:mm:ss.SSSZZ

#### Parameters

| Name | Type |
| :------ | :------ |
| `omrsPayloadString` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L27)

___

### isOmrsDateToday

▸ **isOmrsDateToday**(`date`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) | Checks if the provided date is today. |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L64)

___

### parseDate

▸ **parseDate**(`dateString`): `Date`

Utility function to parse an arbitrary string into a date.
Uses `dayjs(dateString)`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dateString` | `string` |

#### Returns

`Date`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:136](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L136)

___

### toDateObjectStrict

▸ **toDateObjectStrict**(`omrsDateString`): `Date` \| ``null``

Converts the object to a date object if it is a valid ISO date time string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `omrsDateString` | `string` |

#### Returns

`Date` \| ``null``

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L71)

___

### toOmrsDateFormat

▸ **toOmrsDateFormat**(`date`, `format?`): `string`

**`deprecated`** use `formatDate(date)`
Formats the input as a date string. By default the format "YYYY-MMM-DD" is used.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) | `undefined` |
| `format` | `string` | `"YYYY-MMM-DD"` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:128](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L128)

___

### toOmrsDayDateFormat

▸ **toOmrsDayDateFormat**(`date`): `string`

**`deprecated`** use `formatDate(date, "wide")`
Formats the input as a date string using the format "DD - MMM - YYYY".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L112)

___

### toOmrsIsoString

▸ **toOmrsIsoString**(`date`, `toUTC?`): `string`

Formats the input as a date time string using the format "YYYY-MM-DDTHH:mm:ss.SSSZZ".

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) | `undefined` |
| `toUTC` | `boolean` | `false` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:82](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L82)

___

### toOmrsTimeString

▸ **toOmrsTimeString**(`date`): `string`

**`deprecated`** use `formatTime`
Formats the input as a time string using the format "HH:mm A".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L104)

___

### toOmrsTimeString24

▸ **toOmrsTimeString24**(`date`): `string`

**`deprecated`** use `formatTime`
Formats the input as a time string using the format "HH:mm".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:96](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L96)

___

### toOmrsYearlessDateFormat

▸ **toOmrsYearlessDateFormat**(`date`): `string`

**`deprecated`** use `formatDate(date, "no year")`
Formats the input as a date string using the format "DD-MMM".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateInput`](API.md#dateinput) |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:120](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L120)

___

## Navigation Functions

### interpolateString

▸ **interpolateString**(`template`, `params`): `string`

Interpolates values of `params` into the `template` string.

Useful for additional template parameters in URLs.

Example usage:
```js
navigate({
 to: interpolateString(
   config.links.patientChart,
   { patientUuid: patient.uuid }
 )
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | `string` | With optional params wrapped in `${ }` |
| `params` | `object` | Values to interpolate into the string template |

#### Returns

`string`

#### Defined in

[packages/framework/esm-config/src/navigation/interpolate-string.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/interpolate-string.ts#L41)

___

### interpolateUrl

▸ **interpolateUrl**(`template`): `string`

Interpolates a string with openmrsBase and openmrsSpaBase.

Useful for accepting `${openmrsBase}` or `${openmrsSpaBase}` template
parameters in configurable URLs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | `string` | A string to interpolate |

#### Returns

`string`

#### Defined in

[packages/framework/esm-config/src/navigation/interpolate-string.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/interpolate-string.ts#L14)

___

### isUrl

▸ `Const` **isUrl**(`value`): `string` \| `void`

Verifies that a string contains only the default URL template parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`string` \| `void`

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L55)

___

### isUrlWithTemplateParameters

▸ `Const` **isUrlWithTemplateParameters**(`allowedTemplateParameters`): [`Validator`](API.md#validator)

Verifies that a string contains only the default URL template
parameters, plus any specified in `allowedTemplateParameters`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowedTemplateParameters` | `string`[] | To be added to `openmrsBase` and `openmrsSpaBase` |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L23)

___

### navigate

▸ **navigate**(`to`): `void`

Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths

Example usage:
```js
const config = getConfig();
const submitHandler = () => {
  navigate({ to: config.links.submitSuccess });
};
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `to` | [`NavigateOptions`](interfaces/NavigateOptions.md) | The target path or URL. Supports templating with 'openmrsBase' and 'openmrsSpaBase'. For example, `${openmrsSpaBase}/home` will resolve to `/openmrs/spa/home` for implementations using the standard OpenMRS and SPA base paths. |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/navigation/navigate.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/navigate.ts#L29)

___

## Other Functions

### activateOfflineCapability

▸ **activateOfflineCapability**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/mode.ts:65](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/mode.ts#L65)

___

### age

▸ **age**(`dateString`): `string`

Gets a human readable age represention of the provided date string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dateString` | `string` | The stringified date. |

#### Returns

`string`

A human-readable string version of the age.

#### Defined in

[packages/framework/esm-utils/src/age-helpers.tsx:37](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L37)

___

### attach

▸ **attach**(`slotName`, `extensionId`): `void`

Attach an extension to an extension slot.

This will cause the extension to be rendered into the specified
extension slot, unless it is removed by configuration. Using
`attach` is an alternative to specifying the `slot` or `slots`
in the extension declaration.

It is particularly useful when creating a slot into which
you want to render an existing extension. This enables you
to do so without modifying the extension's declaration, which
may be impractical or inappropriate, for example if you are
writing a module for a specific implementation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` | a name uniquely identifying the slot |
| `extensionId` | `string` | an extension name, with an optional #-suffix    to distinguish it from other instances of the same extension    attached to the same slot. |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:126](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L126)

___

### beginEditSynchronizationItem

▸ **beginEditSynchronizationItem**(`id`): `Promise`<`void`\>

Triggers an edit flow for the given synchronization item.
If this is not possible, throws an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` | The ID of the synchronization item to be edited. |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:354](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L354)

___

### canBeginEditSynchronizationItemsOfType

▸ **canBeginEditSynchronizationItemsOfType**(`type`): `boolean`

Returns whether editing synchronization items of the given type is supported by the currently
registered synchronization handlers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | The identifying type of the synchronization item which should be edited. |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:344](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L344)

___

### checkStatus

▸ **checkStatus**(`online?`, `offline?`): `boolean`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `online` | `boolean` \| `object` | `true` |
| `offline` | `boolean` \| `object` | `false` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-extensions/src/helpers.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L1)

___

### checkStatusFor

▸ **checkStatusFor**(`status`, `online?`, `offline?`): `boolean`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | `boolean` | `undefined` |
| `online` | `boolean` \| `object` | `true` |
| `offline` | `boolean` \| `object` | `false` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-extensions/src/helpers.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L9)

___

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

[packages/framework/esm-error-handling/src/index.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-error-handling/src/index.ts#L31)

___

### createGlobalStore

▸ **createGlobalStore**<`TState`\>(`name`, `initialState`): `Store`<`TState`\>

Creates a Unistore [store](https://github.com/developit/unistore#store).

#### Type parameters

| Name |
| :------ |
| `TState` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | A name by which the store can be looked up later.    Must be unique across the entire application. |
| `initialState` | `TState` | An object which will be the initial state of the store. |

#### Returns

`Store`<`TState`\>

The newly created store.

#### Defined in

[packages/framework/esm-state/src/state.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L18)

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

[packages/framework/esm-react-utils/src/createUseStore.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/createUseStore.ts#L21)

___

### daysIntoYear

▸ **daysIntoYear**(`date`): `number`

Gets the number of days in the year of the given date.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to compute the days within the year. |

#### Returns

`number`

The number of days.

#### Defined in

[packages/framework/esm-utils/src/age-helpers.tsx:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L6)

___

### defineConfigSchema

▸ **defineConfigSchema**(`moduleName`, `schema`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |
| `schema` | [`ConfigSchema`](interfaces/ConfigSchema.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:170](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L170)

___

### deleteSynchronizationItem

▸ **deleteSynchronizationItem**(`id`): `Promise`<`void`\>

Deletes a queued up sync item with the given ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` | The ID of the synchronization item to be deleted. |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:374](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L374)

___

### detach

▸ **detach**(`extensionSlotName`, `extensionId`): `void`

Avoid using this. Extension attachments should be considered declarative.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |
| `extensionId` | `string` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:157](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L157)

___

### detachAll

▸ **detachAll**(`extensionSlotName`): `void`

Avoid using this. Extension attachments should be considered declarative.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:181](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L181)

___

### dispatchConnectivityChanged

▸ **dispatchConnectivityChanged**(`online`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `online` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L7)

___

### dispatchNetworkRequestFailed

▸ **dispatchNetworkRequestFailed**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`NetworkRequestFailedEvent`](interfaces/NetworkRequestFailedEvent.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/events.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L5)

___

### dispatchNotificationShown

▸ **dispatchNotificationShown**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ShowNotificationEvent`](interfaces/ShowNotificationEvent.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L81)

___

### dispatchPrecacheStaticDependencies

▸ **dispatchPrecacheStaticDependencies**(`data?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`PrecacheStaticDependenciesEvent`](interfaces/PrecacheStaticDependenciesEvent.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/events.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L34)

___

### generateOfflineUuid

▸ **generateOfflineUuid**(): `string`

Generates a UUID-like string which is used for uniquely identifying objects while offline.

#### Returns

`string`

#### Defined in

[packages/framework/esm-offline/src/uuid.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/uuid.ts#L6)

___

### getAppState

▸ **getAppState**(): `Store`<[`AppState`](interfaces/AppState.md)\>

#### Returns

`Store`<[`AppState`](interfaces/AppState.md)\>

The [store](https://github.com/developit/unistore#store) named `app`.

#### Defined in

[packages/framework/esm-state/src/state.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L85)

___

### getAssignedExtensions

▸ **getAssignedExtensions**(`slotName`): [`AssignedExtension`](interfaces/AssignedExtension.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `slotName` | `string` |

#### Returns

[`AssignedExtension`](interfaces/AssignedExtension.md)[]

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:249](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L249)

___

### getAsyncExtensionLifecycle

▸ `Const` **getAsyncExtensionLifecycle**<`T`\>(`lazy`, `options`): () => `Promise`<`ReactAppOrParcel`<`any`\>\>

**`deprecated`** Use getAsyncLifecycle instead.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `lazy` | () => `Promise`<{ `default`: `ComponentType`<`T`\>  }\> |
| `options` | [`ComponentDecoratorOptions`](interfaces/ComponentDecoratorOptions.md) |

#### Returns

`fn`

▸ (): `Promise`<`ReactAppOrParcel`<`any`\>\>

##### Returns

`Promise`<`ReactAppOrParcel`<`any`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L38)

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
| `options` | [`ComponentDecoratorOptions`](interfaces/ComponentDecoratorOptions.md) |

#### Returns

`fn`

▸ (): `Promise`<`ReactAppOrParcel`<`any`\>\>

##### Returns

`Promise`<`ReactAppOrParcel`<`any`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L20)

___

### getConfig

▸ **getConfig**(`moduleName`): `Promise`<[`Config`](interfaces/Config.md)\>

A promise-based way to access the config as soon as it is fully loaded.
If it is already loaded, resolves the config in its present state.

In general you should use the Unistore-based API provided by
`getConfigStore`, which allows creating a subscription so that you always
have the latest config. If using React, just use `useConfig`.

This is a useful function if you need to get the config in the course
of the execution of a function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` | The name of the module for which to look up the config |

#### Returns

`Promise`<[`Config`](interfaces/Config.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:198](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L198)

___

### getConnectedExtensions

▸ **getConnectedExtensions**(`assignedExtensions`, `online?`): [`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

Filters a list of extensions according to whether they support the
current connectivity status.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `assignedExtensions` | [`AssignedExtension`](interfaces/AssignedExtension.md)[] | `undefined` | The list of extensions to filter. |
| `online` | ``null`` \| `boolean` | `null` | Whether the app is currently online. If `null`, uses `navigator.onLine`. |

#### Returns

[`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

A list of extensions that should be rendered

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:239](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L239)

___

### getCurrentOfflineMode

▸ **getCurrentOfflineMode**(): [`OfflineModeResult`](interfaces/OfflineModeResult.md)

#### Returns

[`OfflineModeResult`](interfaces/OfflineModeResult.md)

#### Defined in

[packages/framework/esm-offline/src/mode.ts:47](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/mode.ts#L47)

___

### getCustomProps

▸ **getCustomProps**(`online`, `offline`): `object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `online` | `undefined` \| `boolean` \| `object` |
| `offline` | `undefined` \| `boolean` \| `object` |

#### Returns

`object`

#### Defined in

[packages/framework/esm-extensions/src/helpers.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L17)

___

### getExtensionNameFromId

▸ **getExtensionNameFromId**(`extensionId`): `string`

Given an extension ID, which is a string uniquely identifying
an instance of an extension within an extension slot, this
returns the extension name.

**`example`**
```js
getExtensionNameFromId("foo#bar")
 --> "foo"
getExtensionNameFromId("baz")
 --> "baz"
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionId` | `string` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L70)

___

### getExtensionRegistration

▸ **getExtensionRegistration**(`extensionId`): [`ExtensionRegistration`](interfaces/ExtensionRegistration.md) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionId` | `string` |

#### Returns

[`ExtensionRegistration`](interfaces/ExtensionRegistration.md) \| `undefined`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:83](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L83)

___

### getExtensionRegistrationFrom

▸ **getExtensionRegistrationFrom**(`state`, `extensionId`): [`ExtensionRegistration`](interfaces/ExtensionRegistration.md) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ExtensionInternalStore`](interfaces/ExtensionInternalStore.md) |
| `extensionId` | `string` |

#### Returns

[`ExtensionRegistration`](interfaces/ExtensionRegistration.md) \| `undefined`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L75)

___

### getExtensionStore

▸ `Const` **getExtensionStore**(): `Store`<[`ExtensionStore`](interfaces/ExtensionStore.md)\>

This returns a [store](https://github.com/developit/unistore#store)
that modules can use to get information about the state of the
extension system.

#### Returns

`Store`<[`ExtensionStore`](interfaces/ExtensionStore.md)\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:129](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L129)

___

### getGlobalStore

▸ **getGlobalStore**<`TState`\>(`name`, `fallbackState?`): `Store`<`TState`\>

Returns the existing [store](https://github.com/developit/unistore#store) named `name`,
or creates a new store named `name` if none exists.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TState` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the store to look up. |
| `fallbackState?` | `TState` | The initial value of the new store if no store named `name` exists. |

#### Returns

`Store`<`TState`\>

The found or newly created store.

#### Defined in

[packages/framework/esm-state/src/state.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L55)

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
| `options` | [`ComponentDecoratorOptions`](interfaces/ComponentDecoratorOptions.md) |

#### Returns

`ReactAppOrParcel`<`any`\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L9)

___

### getOfflinePatientDataStore

▸ **getOfflinePatientDataStore**(): `Store`<[`OfflinePatientDataSyncStore`](interfaces/OfflinePatientDataSyncStore.md)\>

#### Returns

`Store`<[`OfflinePatientDataSyncStore`](interfaces/OfflinePatientDataSyncStore.md)\>

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L85)

___

### getOfflineSynchronizationStore

▸ **getOfflineSynchronizationStore**(): `Store`<[`OfflineSynchronizationStore`](interfaces/OfflineSynchronizationStore.md)\>

#### Returns

`Store`<[`OfflineSynchronizationStore`](interfaces/OfflineSynchronizationStore.md)\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:133](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L133)

___

### getOmrsServiceWorker

▸ **getOmrsServiceWorker**(): `Promise`<`Workbox` \| `undefined`\>

If a service worker has been registered, returns a promise that resolves to a {@link Workbox}
instance which is used by the application to manage that service worker.

If no service worker has been registered (e.g. when the application is built without offline specific features),
returns a promise which immediately resolves to `undefined`.

#### Returns

`Promise`<`Workbox` \| `undefined`\>

A promise which either resolves to `undefined` or to the app's {@link Workbox} instance.

#### Defined in

[packages/framework/esm-offline/src/service-worker.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L42)

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
| `options` | [`ComponentDecoratorOptions`](interfaces/ComponentDecoratorOptions.md) |

#### Returns

`fn`

▸ (): `Promise`<`ReactAppOrParcel`<`any`\>\>

##### Returns

`Promise`<`ReactAppOrParcel`<`any`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L28)

___

### getSynchronizationItem

▸ **getSynchronizationItem**<`T`\>(`id`): `Promise`<[`SyncItem`](interfaces/SyncItem.md)<`T`\> \| `undefined`\>

Returns a queued sync item with the given ID or `undefined` if no such item exists.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` | The ID of the requested sync item. |

#### Returns

`Promise`<[`SyncItem`](interfaces/SyncItem.md)<`T`\> \| `undefined`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:333](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L333)

___

### getSynchronizationItems

▸ **getSynchronizationItems**<`T`\>(`type`): `Promise`<`T`[]\>

Returns all currently queued up sync items of the currently signed in user.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | The identifying type of the synchronization items to be returned. |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:324](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L324)

___

### getSynchronizationItemsFor

▸ **getSynchronizationItemsFor**<`T`\>(`userId`, `type`): `Promise`<`T`[]\>

Returns all currently queued up sync items of a given user.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | The ID of the user whose synchronization items should be returned. |
| `type` | `string` | The identifying type of the synchronization items to be returned.. |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:306](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L306)

___

### handleApiError

▸ **handleApiError**(): (`incomingResponseErr`: `any`) => `void`

#### Returns

`fn`

▸ (`incomingResponseErr`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `incomingResponseErr` | `any` |

##### Returns

`void`

#### Defined in

[packages/framework/esm-error-handling/src/index.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-error-handling/src/index.ts#L3)

___

### inRange

▸ `Const` **inRange**(`min`, `max`): [`Validator`](API.md#validator)

Verifies that the value is between the provided minimum and maximum

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` | Minimum acceptable value |
| `max` | `number` | Maximum acceptable value |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L9)

___

### integrateBreakpoints

▸ **integrateBreakpoints**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/breakpoints/index.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/breakpoints/index.ts#L20)

___

### isOfflineUuid

▸ **isOfflineUuid**(`uuid`): `boolean`

Checks whether the given string has the format of an offline UUID generated by [generateOfflineUuid](API.md#generateofflineuuid)

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-offline/src/uuid.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/uuid.ts#L11)

___

### isSameDay

▸ **isSameDay**(`firstDate`, `secondDate`): `boolean`

Checks if two dates are representing the same day.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `firstDate` | `Date` | The first date. |
| `secondDate` | `Date` | The second date. |

#### Returns

`boolean`

True if both are located on the same day.

#### Defined in

[packages/framework/esm-utils/src/age-helpers.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L23)

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

[packages/framework/esm-utils/src/version.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/version.ts#L21)

___

### loadPersistedPatientDataSyncState

▸ **loadPersistedPatientDataSyncState**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:199](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L199)

___

### messageOmrsServiceWorker

▸ **messageOmrsServiceWorker**(`message`): `Promise`<[`MessageServiceWorkerResult`](interfaces/MessageServiceWorkerResult.md)<`any`\>\>

Sends the specified message to the application's service worker.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`KnownOmrsServiceWorkerMessages`](API.md#knownomrsserviceworkermessages) | The message to be sent. |

#### Returns

`Promise`<[`MessageServiceWorkerResult`](interfaces/MessageServiceWorkerResult.md)<`any`\>\>

A promise which completes when the message has been successfully processed by the Service Worker.

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L10)

___

### openmrsComponentDecorator

▸ **openmrsComponentDecorator**(`userOpts`): (`Comp`: `ComponentType`<{}\>) => `ComponentType`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userOpts` | [`ComponentDecoratorOptions`](interfaces/ComponentDecoratorOptions.md) |

#### Returns

`fn`

▸ (`Comp`): `ComponentType`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `Comp` | `ComponentType`<{}\> |

##### Returns

`ComponentType`<`any`\>

#### Defined in

[packages/framework/esm-react-utils/src/openmrsComponentDecorator.tsx:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/openmrsComponentDecorator.tsx#L71)

___

### patchXMLHttpRequest

▸ **patchXMLHttpRequest**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/patches.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/patches.ts#L1)

___

### processConfig

▸ **processConfig**(`schema`, `providedConfig`, `keyPathContext`, `devDefaultsAreOn?`): [`Config`](interfaces/Config.md)

Validate and interpolate defaults for `providedConfig` according to `schema`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `schema` | [`ConfigSchema`](interfaces/ConfigSchema.md) | `undefined` | a configuration schema |
| `providedConfig` | [`ConfigObject`](interfaces/ConfigObject.md) | `undefined` | an object of config values (without the top-level module name) |
| `keyPathContext` | `string` | `undefined` | a dot-deparated string which helps the user figure out where     the provided config came from |
| `devDefaultsAreOn` | `boolean` | `false` | - |

#### Returns

[`Config`](interfaces/Config.md)

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:220](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L220)

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

[packages/framework/esm-config/src/module-config/module-config.ts:178](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L178)

___

### pushNavigationContext

▸ **pushNavigationContext**(`_context`): () => `void`

**`deprecated`** don't use

#### Parameters

| Name | Type |
| :------ | :------ |
| `_context` | [`NavigationContext`](interfaces/NavigationContext.md) |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/contexts.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L24)

___

### queueSynchronizationItem

▸ **queueSynchronizationItem**<`T`\>(`type`, `content`, `descriptor?`): `Promise`<`number`\>

Enqueues a new item in the sync queue and associates the item with the currently signed in user.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | The identifying type of the synchronization item. |
| `content` | `T` | The actual data to be synchronized. |
| `descriptor?` | [`QueueItemDescriptor`](interfaces/QueueItemDescriptor.md) | An optional descriptor providing additional metadata about the sync item. |

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:292](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L292)

___

### queueSynchronizationItemFor

▸ **queueSynchronizationItemFor**<`T`\>(`userId`, `type`, `content`, `descriptor?`): `Promise`<`number`\>

Enqueues a new item in the sync queue for a specific user.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | The user with whom the sync item should be associated with. |
| `type` | `string` | The identifying type of the synchronization item. |
| `content` | `T` | The actual data to be synchronized. |
| `descriptor?` | [`QueueItemDescriptor`](interfaces/QueueItemDescriptor.md) | An optional descriptor providing additional metadata about the sync item. |

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:258](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L258)

___

### registerOfflinePatientHandler

▸ **registerOfflinePatientHandler**(`identifier`, `handler`): `void`

Attempts to add the specified patient handler registration to the list of offline patient handlers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `identifier` | `string` | A key which uniquely identifies the registration. |
| `handler` | [`OfflinePatientDataSyncHandler`](interfaces/OfflinePatientDataSyncHandler.md) | The patient handler registration to be registered. |

#### Returns

`void`

`true` if the registration was successfully made; `false` if another registration with
  the same identifier has already been registered before.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:96](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L96)

___

### registerOmrsServiceWorker

▸ **registerOmrsServiceWorker**(`scriptUrl`, `registerOptions?`): `Promise`<`Workbox`\>

If not yet registered, registers the application's global Service Worker.
Throws if registration is not possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptUrl` | `string` |
| `registerOptions?` | `object` |

#### Returns

`Promise`<`Workbox`\>

A promise which resolves to the registered {@link Workbox} instance which manages the SW.

#### Defined in

[packages/framework/esm-offline/src/service-worker.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L12)

___

### renderExtension

▸ **renderExtension**(`domElement`, `extensionSlotName`, `extensionSlotModuleName`, `extensionId`, `renderFunction?`, `additionalProps?`): [`CancelLoading`](interfaces/CancelLoading.md)

Mounts into a DOM node (representing an extension slot)
a lazy-loaded component from *any* frontend module
that registered an extension component for this slot.

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

[`CancelLoading`](interfaces/CancelLoading.md)

#### Defined in

[packages/framework/esm-extensions/src/render.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/render.ts#L17)

___

### renderInlineNotifications

▸ **renderInlineNotifications**(`target`): `void`

Starts a rendering host for inline notifications. Should only be used by the app shell.
Under normal conditions there is no need to use this function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | ``null`` \| `HTMLElement` | The container target that hosts the inline notifications. |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/notifications/index.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L19)

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

[packages/framework/esm-styleguide/src/spinner/index.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/spinner/index.ts#L1)

___

### renderModals

▸ **renderModals**(`modalContainer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `modalContainer` | ``null`` \| `HTMLElement` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/modals/index.tsx:109](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/modals/index.tsx#L109)

___

### renderToasts

▸ **renderToasts**(`target`): `void`

Starts a rendering host for toast notifications. Should only be used by the app shell.
Under normal conditions there is no need to use this function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | ``null`` \| `HTMLElement` | The container target that hosts the toast notifications. |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/toasts/index.tsx:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/toasts/index.tsx#L16)

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

[packages/framework/esm-error-handling/src/index.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-error-handling/src/index.ts#L24)

___

### retry

▸ **retry**<`T`\>(`fn`, `options?`): `Promise`<`T`\>

Executes the specified function and retries executing on failure with a custom backoff strategy
defined by the options.

If not configured otherwise, this function uses the following default options:
* Retries 5 times beyond the initial attempt.
* Uses an exponential backoff starting with an initial delay of 1000ms.

**`throws`** Rethrows the final error of running `fn` when the function stops retrying.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => `Promise`<`T`\> | The function to be executed and retried on failure. |
| `options` | [`RetryOptions`](interfaces/RetryOptions.md) | Additional options which configure the retry behavior. |

#### Returns

`Promise`<`T`\>

The result of successfully executing `fn`.

#### Defined in

[packages/framework/esm-utils/src/retry.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/retry.ts#L38)

___

### runSynchronization

▸ **runSynchronization**(): `Promise`<`void`\>

Runs a full synchronization of **all** queued synchronization items.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:140](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L140)

___

### setCurrentOfflineMode

▸ **setCurrentOfflineMode**(`mode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mode` | [`OfflineMode`](API.md#offlinemode) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/mode.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/mode.ts#L55)

___

### setupOfflineSync

▸ **setupOfflineSync**<`T`\>(`type`, `dependsOn`, `process`, `options?`): `void`

Registers a new synchronization handler which is able to synchronize data of a specific type.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | The identifying type of the synchronization items which can be handled by this handler. |
| `dependsOn` | `string`[] | An array of other sync item types which must be synchronized before this handler   can synchronize its own data. Items of these types are effectively dependencies of the data   synchronized by this handler. |
| `process` | [`ProcessSyncItem`](API.md#processsyncitem)<`T`\> | A function which, when invoked, performs the actual client-server synchronization of the given   `item` (which is the actual data to be synchronized). |
| `options` | `SetupOfflineSyncOptions`<`T`\> | Additional options which can optionally be provided when setting up a synchronization callback   for a specific synchronization item type. |

#### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:389](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L389)

___

### setupPaths

▸ **setupPaths**(`config`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`SpaConfig`](interfaces/SpaConfig.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/globals.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/globals.ts#L3)

___

### setupUtils

▸ **setupUtils**(): `void`

#### Returns

`void`

#### Defined in

[packages/framework/esm-globals/src/globals.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/globals.ts#L11)

___

### showModal

▸ **showModal**(`extensionId`, `props?`, `onClose?`): () => `void`

Shows the provided extension component in a modal dialog.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionId` | `string` | The id of the extension to show. |
| `props` | `Record`<`string`, `any`\> | The optional props to provide to the extension. |
| `onClose` | () => `void` | The optional notification to receive when the modal is closed. |

#### Returns

`fn`

The dispose function to force closing the modal dialog.

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/modals/index.tsx:163](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/modals/index.tsx#L163)

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

[packages/framework/esm-styleguide/src/notifications/index.tsx:40](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L40)

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

[packages/framework/esm-styleguide/src/toasts/index.tsx:34](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/toasts/index.tsx#L34)

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

[packages/framework/esm-globals/src/events.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L22)

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

[packages/framework/esm-globals/src/events.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L13)

___

### subscribeNetworkRequestFailed

▸ **subscribeNetworkRequestFailed**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [`NetworkRequestFailedEvent`](interfaces/NetworkRequestFailedEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/events.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L11)

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

[packages/framework/esm-globals/src/events.ts:87](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L87)

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

[packages/framework/esm-globals/src/events.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L42)

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

[packages/framework/esm-state/src/state.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L89)

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

[packages/framework/esm-globals/src/events.ts:95](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L95)

___

### switchTo

▸ **switchTo**<`T`\>(`_type`, `link`, `_state?`): `void`

**`deprecated`** use `navigate` directly

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_type` | [`NavigationContextType`](API.md#navigationcontexttype) |
| `link` | `string` |
| `_state?` | `T` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/contexts.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L13)

___

### syncOfflinePatientData

▸ **syncOfflinePatientData**(`patientUuid`): `Promise`<`void`\>

Notifies all registered offline patient handlers that a new patient must be made available offline.

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | `string` |

#### Returns

`Promise`<`void`\>

A promise which resolves once all registered handlers have finished synchronizing.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:111](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L111)

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

[packages/framework/esm-utils/src/translate.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/translate.ts#L3)

___

### update

▸ **update**<`T`\>(`obj`, `__namedParameters`, `value`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `T` |
| `__namedParameters` | `string`[] |
| `value` | `any` |

#### Returns

`T`

#### Defined in

[packages/framework/esm-state/src/update.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/update.ts#L1)

___

### useAssignedExtensionIds

▸ **useAssignedExtensionIds**(`slotName`): `string`[]

Gets the assigned extension ids for a given extension slot name.
Does not consider if offline or online.

**`deprecated`** Use `useAssignedExtensions`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` | The name of the slot to get the assigned IDs for. |

#### Returns

`string`[]

#### Defined in

[packages/framework/esm-react-utils/src/useAssignedExtensionIds.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useAssignedExtensionIds.ts#L12)

___

### useAssignedExtensions

▸ **useAssignedExtensions**(`slotName`): [`AssignedExtension`](interfaces/AssignedExtension.md)[]

Gets the assigned extensions for a given extension slot name.
Does not consider if offline or online.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` | The name of the slot to get the assigned extensions for. |

#### Returns

[`AssignedExtension`](interfaces/AssignedExtension.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useAssignedExtensions.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useAssignedExtensions.ts#L14)

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

[packages/framework/esm-react-utils/src/useBodyScrollLock.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useBodyScrollLock.ts#L3)

___

### useConfig

▸ **useConfig**(): `Object`

Use this React Hook to obtain your module's configuration.

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `constructor` | `Function` | The initial value of Object.prototype.constructor is the standard built-in Object constructor. |
| `hasOwnProperty` | (`v`: `PropertyKey`) => `boolean` | Determines whether an object has a property with the specified name. |
| `isPrototypeOf` | (`v`: `Object`) => `boolean` | Determines whether an object exists in another object's prototype chain. |
| `propertyIsEnumerable` | (`v`: `PropertyKey`) => `boolean` | Determines whether a specified property is enumerable. |
| `toLocaleString` | () => `string` | Returns a date converted to a string using the current locale. |
| `toString` | () => `string` | Returns a string representation of an object. |
| `valueOf` | () => `Object` | Returns the primitive value of the specified object. |

#### Defined in

[packages/framework/esm-react-utils/src/useConfig.ts:103](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConfig.ts#L103)

___

### useConnectedExtensions

▸ **useConnectedExtensions**(`slotName`): [`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

Gets the assigned extension for a given extension slot name.
Considers if offline or online.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` | The name of the slot to get the assigned extensions for. |

#### Returns

[`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useConnectedExtensions.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConnectedExtensions.ts#L14)

___

### useConnectivity

▸ **useConnectivity**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-react-utils/src/useConnectivity.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConnectivity.ts#L4)

___

### useCurrentPatient

▸ **useCurrentPatient**(`patientUuid?`): [`boolean`, `NullablePatient`, [`PatientUuid`](API.md#patientuuid), `Error` \| ``null``]

This React hook returns the current patient, as specified by the current route. It returns
all the information needed to render a loading state, error state, and normal/success state.

**`deprecated`** Use [usePatient](API.md#usepatient) instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | [`PatientUuid`](API.md#patientuuid) |

#### Returns

[`boolean`, `NullablePatient`, [`PatientUuid`](API.md#patientuuid), `Error` \| ``null``]

#### Defined in

[packages/framework/esm-react-utils/src/useCurrentPatient.ts:82](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useCurrentPatient.ts#L82)

___

### useExtensionSlotMeta

▸ **useExtensionSlotMeta**<`T`\>(`extensionSlotName`): `Object`

Extract meta data from all extension for a given extension slot.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`ExtensionMeta`](interfaces/ExtensionMeta.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |

#### Returns

`Object`

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionSlotMeta.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionSlotMeta.ts#L9)

___

### useExtensionStore

▸ `Const` **useExtensionStore**(): `T`

#### Returns

`T`

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionStore.ts#L4)

▸ `Const` **useExtensionStore**(`actions`): `T` & [`BoundActions`](API.md#boundactions)

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | [`Actions`](API.md#actions) |

#### Returns

`T` & [`BoundActions`](API.md#boundactions)

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionStore.ts#L4)

▸ `Const` **useExtensionStore**(`actions?`): `T` & [`BoundActions`](API.md#boundactions)

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions?` | [`Actions`](API.md#actions) |

#### Returns

`T` & [`BoundActions`](API.md#boundactions)

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionStore.ts#L4)

___

### useForceUpdate

▸ **useForceUpdate**(): () => `void`

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/framework/esm-react-utils/src/useForceUpdate.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useForceUpdate.ts#L3)

___

### useLayoutType

▸ **useLayoutType**(): [`LayoutType`](API.md#layouttype)

#### Returns

[`LayoutType`](API.md#layouttype)

#### Defined in

[packages/framework/esm-react-utils/src/useLayoutType.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useLayoutType.ts#L22)

___

### useLocations

▸ **useLocations**(): [`Location`](interfaces/Location.md)[]

#### Returns

[`Location`](interfaces/Location.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useLocations.tsx:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useLocations.tsx#L4)

___

### useNavigationContext

▸ **useNavigationContext**(`context`): `void`

**`deprecated`** Don't use this anymore.

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`NavigationContext`](interfaces/NavigationContext.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-react-utils/src/useNavigationContext.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useNavigationContext.ts#L10)

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

[packages/framework/esm-react-utils/src/useOnClickOutside.tsx:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useOnClickOutside.tsx#L3)

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

[packages/framework/esm-react-utils/src/usePagination.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/usePagination.ts#L5)

___

### usePatient

▸ **usePatient**(`patientUuid?`): `Object`

This React hook returns a patient object. If the `patientUuid` is provided
as a parameter, then the patient for that UUID is returned. If the parameter
is not provided, the patient UUID is obtained from the current route, and
a route listener is set up to update the patient whenever the route changes.

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
| `patient` | `NullablePatient` |
| `patientUuid` | ``null`` \| `string` |

#### Defined in

[packages/framework/esm-react-utils/src/usePatient.ts:91](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/usePatient.ts#L91)

___

### useSessionUser

▸ **useSessionUser**(): ``null`` \| [`SessionUser`](interfaces/SessionUser.md)

#### Returns

``null`` \| [`SessionUser`](interfaces/SessionUser.md)

#### Defined in

[packages/framework/esm-react-utils/src/useSessionUser.tsx:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useSessionUser.tsx#L4)

___

### useStore

▸ **useStore**<`T`\>(`store`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<`T`\> |

#### Returns

`T`

#### Defined in

[packages/framework/esm-react-utils/src/useStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useStore.ts#L4)

▸ **useStore**<`T`\>(`store`, `actions`): `T` & [`BoundActions`](API.md#boundactions)

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

[packages/framework/esm-react-utils/src/useStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useStore.ts#L5)

___

### useStoreState

▸ **useStoreState**<`T`, `U`\>(`store`, `select`): `U`

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

[packages/framework/esm-react-utils/src/useStoreState.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useStoreState.ts#L5)

___

### useVisit

▸ **useVisit**(`patientUuid`, `includeInactive?`): `VisitReturnType`

This React hook returns a visit object. If the `patientUuid` is provided
as a parameter, then the visits, currentVisit, error and mutate function
for that patient visit is returned.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `patientUuid` | `string` | `undefined` | Unique patient identifier `string` |
| `includeInactive` | `boolean` | `false` | Boolean that specifies whether to include Inactive visits `boolean`, defaults to false |

#### Returns

`VisitReturnType`

Object {`visits`, `error` `isValidating`, `currentVisit`, `mutate`}

#### Defined in

[packages/framework/esm-react-utils/src/useVisit.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useVisit.ts#L27)

___

### useVisitTypes

▸ **useVisitTypes**(): [`VisitType`](interfaces/VisitType.md)[]

#### Returns

[`VisitType`](interfaces/VisitType.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useVisitTypes.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useVisitTypes.ts#L4)

___

### validator

▸ **validator**(`validationFunction`, `message`): [`Validator`](API.md#validator)

#### Parameters

| Name | Type |
| :------ | :------ |
| `validationFunction` | [`ValidatorFunction`](API.md#validatorfunction) |
| `message` | `string` |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validator.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validator.ts#L3)
