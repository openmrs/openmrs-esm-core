[Back to README.md](../README.md)

# @openmrs/esm-framework

## Table of contents

### Enumerations

- [Type](enums/Type.md)
- [VisitMode](enums/VisitMode.md)
- [VisitStatus](enums/VisitStatus.md)

### Classes

- [OpenmrsFetchError](classes/OpenmrsFetchError.md)

### Interfaces

- [AppState](interfaces/AppState.md)
- [BreadcrumbRegistration](interfaces/BreadcrumbRegistration.md)
- [BreadcrumbSettings](interfaces/BreadcrumbSettings.md)
- [CancelLoading](interfaces/CancelLoading.md)
- [ClearDynamicRoutesMessage](interfaces/ClearDynamicRoutesMessage.md)
- [ComponentConfig](interfaces/ComponentConfig.md)
- [ComponentDecoratorOptions](interfaces/ComponentDecoratorOptions.md)
- [ComponentDefinition](interfaces/ComponentDefinition.md)
- [Config](interfaces/Config.md)
- [ConfigObject](interfaces/ConfigObject.md)
- [ConfigSchema](interfaces/ConfigSchema.md)
- [ConfigStore](interfaces/ConfigStore.md)
- [ConfigurableLinkProps](interfaces/ConfigurableLinkProps.md)
- [ConnectedExtension](interfaces/ConnectedExtension.md)
- [ConnectivityChangedEvent](interfaces/ConnectivityChangedEvent.md)
- [CurrentPatientOptions](interfaces/CurrentPatientOptions.md)
- [CurrentUserOptions](interfaces/CurrentUserOptions.md)
- [CurrentUserWithResponseOption](interfaces/CurrentUserWithResponseOption.md)
- [CurrentUserWithoutResponseOption](interfaces/CurrentUserWithoutResponseOption.md)
- [ExtensionData](interfaces/ExtensionData.md)
- [ExtensionDefinition](interfaces/ExtensionDefinition.md)
- [ExtensionDetails](interfaces/ExtensionDetails.md)
- [ExtensionInfo](interfaces/ExtensionInfo.md)
- [ExtensionInstance](interfaces/ExtensionInstance.md)
- [ExtensionMeta](interfaces/ExtensionMeta.md)
- [ExtensionProps](interfaces/ExtensionProps.md)
- [ExtensionRegistration](interfaces/ExtensionRegistration.md)
- [ExtensionSlotBaseProps](interfaces/ExtensionSlotBaseProps.md)
- [ExtensionSlotConfig](interfaces/ExtensionSlotConfig.md)
- [ExtensionSlotConfigObject](interfaces/ExtensionSlotConfigObject.md)
- [ExtensionSlotConfigsStore](interfaces/ExtensionSlotConfigsStore.md)
- [ExtensionSlotConfigureValueObject](interfaces/ExtensionSlotConfigureValueObject.md)
- [ExtensionSlotInfo](interfaces/ExtensionSlotInfo.md)
- [ExtensionSlotInstance](interfaces/ExtensionSlotInstance.md)
- [ExtensionStore](interfaces/ExtensionStore.md)
- [FHIRCode](interfaces/FHIRCode.md)
- [FHIRRequestObj](interfaces/FHIRRequestObj.md)
- [FHIRResource](interfaces/FHIRResource.md)
- [FetchHeaders](interfaces/FetchHeaders.md)
- [FetchResponse](interfaces/FetchResponse.md)
- [ImplementerToolsConfigStore](interfaces/ImplementerToolsConfigStore.md)
- [ImportMap](interfaces/ImportMap.md)
- [Lifecycle](interfaces/Lifecycle.md)
- [Location](interfaces/Location.md)
- [LoggedInUser](interfaces/LoggedInUser.md)
- [LoggedInUserFetchResponse](interfaces/LoggedInUserFetchResponse.md)
- [MessageServiceWorkerResult](interfaces/MessageServiceWorkerResult.md)
- [NavigateOptions](interfaces/NavigateOptions.md)
- [NavigationContext](interfaces/NavigationContext.md)
- [NetworkRequestFailedEvent](interfaces/NetworkRequestFailedEvent.md)
- [NewVisitPayload](interfaces/NewVisitPayload.md)
- [OfflinePatientArgs](interfaces/OfflinePatientArgs.md)
- [OfflinePatientDataSyncHandler](interfaces/OfflinePatientDataSyncHandler.md)
- [OfflinePatientDataSyncState](interfaces/OfflinePatientDataSyncState.md)
- [OfflinePatientDataSyncStore](interfaces/OfflinePatientDataSyncStore.md)
- [OfflineSynchronizationStore](interfaces/OfflineSynchronizationStore.md)
- [OmrsServiceWorkerEvent](interfaces/OmrsServiceWorkerEvent.md)
- [OmrsServiceWorkerMessage](interfaces/OmrsServiceWorkerMessage.md)
- [OnImportMapChangedMessage](interfaces/OnImportMapChangedMessage.md)
- [OnlyThePatient](interfaces/OnlyThePatient.md)
- [OpenmrsReactComponentProps](interfaces/OpenmrsReactComponentProps.md)
- [OpenmrsReactComponentState](interfaces/OpenmrsReactComponentState.md)
- [OpenmrsResource](interfaces/OpenmrsResource.md)
- [PageDefinition](interfaces/PageDefinition.md)
- [PatientWithFullResponse](interfaces/PatientWithFullResponse.md)
- [Person](interfaces/Person.md)
- [PrecacheStaticDependenciesEvent](interfaces/PrecacheStaticDependenciesEvent.md)
- [Privilege](interfaces/Privilege.md)
- [QueueItemDescriptor](interfaces/QueueItemDescriptor.md)
- [RegisterDynamicRouteMessage](interfaces/RegisterDynamicRouteMessage.md)
- [ResourceLoader](interfaces/ResourceLoader.md)
- [RetryOptions](interfaces/RetryOptions.md)
- [Role](interfaces/Role.md)
- [SessionLocation](interfaces/SessionLocation.md)
- [SessionUser](interfaces/SessionUser.md)
- [ShowNotificationEvent](interfaces/ShowNotificationEvent.md)
- [ShowToastEvent](interfaces/ShowToastEvent.md)
- [SpaConfig](interfaces/SpaConfig.md)
- [SyncItem](interfaces/SyncItem.md)
- [SyncProcessOptions](interfaces/SyncProcessOptions.md)
- [UnauthenticatedUser](interfaces/UnauthenticatedUser.md)
- [User](interfaces/User.md)
- [UserHasAccessProps](interfaces/UserHasAccessProps.md)
- [Visit](interfaces/Visit.md)
- [VisitItem](interfaces/VisitItem.md)
- [VisitType](interfaces/VisitType.md)
- [WorkspaceItem](interfaces/WorkspaceItem.md)

### Type aliases

- [Actions](API.md#actions)
- [BoundActions](API.md#boundactions)
- [ConfigValue](API.md#configvalue)
- [CurrentPatient](API.md#currentpatient)
- [DateInput](API.md#dateinput)
- [ExtensionSlotProps](API.md#extensionslotprops)
- [FormatDateMode](API.md#formatdatemode)
- [FormatDateOptions](API.md#formatdateoptions)
- [KnownOmrsServiceWorkerEvents](API.md#knownomrsserviceworkerevents)
- [KnownOmrsServiceWorkerMessages](API.md#knownomrsserviceworkermessages)
- [LayoutType](API.md#layouttype)
- [LoggedInUserData](API.md#loggedinuserdata)
- [MaybeAsync](API.md#maybeasync)
- [NavigationContextType](API.md#navigationcontexttype)
- [OmrsOfflineCachingStrategy](API.md#omrsofflinecachingstrategy)
- [OmrsOfflineHttpHeaderNames](API.md#omrsofflinehttpheadernames)
- [OmrsOfflineHttpHeaders](API.md#omrsofflinehttpheaders)
- [PatientUuid](API.md#patientuuid)
- [ProcessSyncItem](API.md#processsyncitem)
- [ProvidedConfig](API.md#providedconfig)
- [SpaEnvironment](API.md#spaenvironment)
- [UpdateVisitPayload](API.md#updatevisitpayload)
- [Validator](API.md#validator)
- [ValidatorFunction](API.md#validatorfunction)

### API Variables

- [fhir](API.md#fhir)

### Navigation Variables

- [ConfigurableLink](API.md#configurablelink)

### Other Variables

- [ComponentContext](API.md#componentcontext)
- [Extension](API.md#extension)
- [ExtensionSlot](API.md#extensionslot)
- [UserHasAccess](API.md#userhasaccess)
- [backendDependencies](API.md#backenddependencies)
- [extensionStore](API.md#extensionstore)
- [fhirBaseUrl](API.md#fhirbaseurl)
- [getStartedVisit](API.md#getstartedvisit)
- [implementerToolsConfigStore](API.md#implementertoolsconfigstore)
- [offlineUuidPrefix](API.md#offlineuuidprefix)
- [omrsOfflineCachingStrategyHttpHeaderName](API.md#omrsofflinecachingstrategyhttpheadername)
- [omrsOfflineResponseBodyHttpHeaderName](API.md#omrsofflineresponsebodyhttpheadername)
- [omrsOfflineResponseStatusHttpHeaderName](API.md#omrsofflineresponsestatushttpheadername)
- [sessionEndpoint](API.md#sessionendpoint)
- [temporaryConfigStore](API.md#temporaryconfigstore)
- [validators](API.md#validators)

### API Functions

- [openmrsFetch](API.md#openmrsfetch)
- [openmrsObservableFetch](API.md#openmrsobservablefetch)

### API Object Functions

- [fetchCurrentPatient](API.md#fetchcurrentpatient)
- [getCurrentUser](API.md#getcurrentuser)
- [refetchCurrentUser](API.md#refetchcurrentuser)

### Breadcrumb Functions

- [filterBreadcrumbs](API.md#filterbreadcrumbs)
- [getBreadcrumbs](API.md#getbreadcrumbs)
- [getBreadcrumbsFor](API.md#getbreadcrumbsfor)
- [registerBreadcrumb](API.md#registerbreadcrumb)
- [registerBreadcrumbs](API.md#registerbreadcrumbs)

### Navigation Functions

- [interpolateString](API.md#interpolatestring)
- [isUrl](API.md#isurl)
- [isUrlWithTemplateParameters](API.md#isurlwithtemplateparameters)
- [navigate](API.md#navigate)

### Other Functions

- [age](API.md#age)
- [attach](API.md#attach)
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
- [formatDate](API.md#formatdate)
- [formatDatetime](API.md#formatdatetime)
- [formatTime](API.md#formattime)
- [generateOfflineUuid](API.md#generateofflineuuid)
- [getAppState](API.md#getappstate)
- [getAssignedIds](API.md#getassignedids)
- [getAsyncExtensionLifecycle](API.md#getasyncextensionlifecycle)
- [getAsyncLifecycle](API.md#getasynclifecycle)
- [getConfig](API.md#getconfig)
- [getConfigStore](API.md#getconfigstore)
- [getCustomProps](API.md#getcustomprops)
- [getExtensionConfigStore](API.md#getextensionconfigstore)
- [getExtensionNameFromId](API.md#getextensionnamefromid)
- [getExtensionRegistration](API.md#getextensionregistration)
- [getExtensionRegistrationFrom](API.md#getextensionregistrationfrom)
- [getExtensionSlotsConfigStore](API.md#getextensionslotsconfigstore)
- [getExtensionSlotsForModule](API.md#getextensionslotsformodule)
- [getGlobalStore](API.md#getglobalstore)
- [getLifecycle](API.md#getlifecycle)
- [getLocations](API.md#getlocations)
- [getLoggedInUser](API.md#getloggedinuser)
- [getOfflinePatientDataStore](API.md#getofflinepatientdatastore)
- [getOfflineSynchronizationStore](API.md#getofflinesynchronizationstore)
- [getOmrsServiceWorker](API.md#getomrsserviceworker)
- [getSessionLocation](API.md#getsessionlocation)
- [getSyncLifecycle](API.md#getsynclifecycle)
- [getSynchronizationItems](API.md#getsynchronizationitems)
- [getSynchronizationItemsFor](API.md#getsynchronizationitemsfor)
- [getUpdatedExtensionSlotInfo](API.md#getupdatedextensionslotinfo)
- [getVisitTypes](API.md#getvisittypes)
- [getVisitsForPatient](API.md#getvisitsforpatient)
- [handleApiError](API.md#handleapierror)
- [inRange](API.md#inrange)
- [integrateBreakpoints](API.md#integratebreakpoints)
- [isOfflineUuid](API.md#isofflineuuid)
- [isOmrsDateStrict](API.md#isomrsdatestrict)
- [isOmrsDateToday](API.md#isomrsdatetoday)
- [isSameDay](API.md#issameday)
- [isVersionSatisfied](API.md#isversionsatisfied)
- [loadPersistedPatientDataSyncState](API.md#loadpersistedpatientdatasyncstate)
- [makeUrl](API.md#makeurl)
- [messageOmrsServiceWorker](API.md#messageomrsserviceworker)
- [openVisitsNoteWorkspace](API.md#openvisitsnoteworkspace)
- [openmrsComponentDecorator](API.md#openmrscomponentdecorator)
- [parseDate](API.md#parsedate)
- [patchXMLHttpRequest](API.md#patchxmlhttprequest)
- [processConfig](API.md#processconfig)
- [provide](API.md#provide)
- [pushNavigationContext](API.md#pushnavigationcontext)
- [queueSynchronizationItem](API.md#queuesynchronizationitem)
- [queueSynchronizationItemFor](API.md#queuesynchronizationitemfor)
- [registerExtension](API.md#registerextension)
- [registerExtensionSlot](API.md#registerextensionslot)
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
- [saveVisit](API.md#savevisit)
- [setSessionLocation](API.md#setsessionlocation)
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
- [toDateObjectStrict](API.md#todateobjectstrict)
- [toLocationObject](API.md#tolocationobject)
- [toOmrsDateFormat](API.md#toomrsdateformat)
- [toOmrsDayDateFormat](API.md#toomrsdaydateformat)
- [toOmrsIsoString](API.md#toomrsisostring)
- [toOmrsTimeString](API.md#toomrstimestring)
- [toOmrsTimeString24](API.md#toomrstimestring24)
- [toOmrsYearlessDateFormat](API.md#toomrsyearlessdateformat)
- [toVisitTypeObject](API.md#tovisittypeobject)
- [translateFrom](API.md#translatefrom)
- [unregisterExtensionSlot](API.md#unregisterextensionslot)
- [update](API.md#update)
- [updateExtensionStore](API.md#updateextensionstore)
- [updateVisit](API.md#updatevisit)
- [useAssignedExtensionIds](API.md#useassignedextensionids)
- [useAttachedExtensionIds](API.md#useattachedextensionids)
- [useBodyScrollLock](API.md#usebodyscrolllock)
- [useConfig](API.md#useconfig)
- [useConnectedExtensions](API.md#useconnectedextensions)
- [useConnectivity](API.md#useconnectivity)
- [useCurrentPatient](API.md#usecurrentpatient)
- [useExtension](API.md#useextension)
- [useExtensionSlot](API.md#useextensionslot)
- [useExtensionSlotConfig](API.md#useextensionslotconfig)
- [useExtensionSlotMeta](API.md#useextensionslotmeta)
- [useExtensionStore](API.md#useextensionstore)
- [useForceUpdate](API.md#useforceupdate)
- [useLayoutType](API.md#uselayouttype)
- [useLocations](API.md#uselocations)
- [useNavigationContext](API.md#usenavigationcontext)
- [useOnClickOutside](API.md#useonclickoutside)
- [usePagination](API.md#usepagination)
- [useSessionUser](API.md#usesessionuser)
- [useStore](API.md#usestore)
- [useStoreState](API.md#usestorestate)
- [useVisit](API.md#usevisit)
- [useVisitTypes](API.md#usevisittypes)
- [userHasAccess](API.md#userhasaccess)
- [validator](API.md#validator)

### Workspace Functions

- [getNewWorkspaceItem](API.md#getnewworkspaceitem)
- [newWorkspaceItem](API.md#newworkspaceitem)

## Type aliases

### Actions

Ƭ **Actions**: `Function` \| { [key: string]: `Function`;  }

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

[packages/framework/esm-config/src/types.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L30)

___

### CurrentPatient

Ƭ **CurrentPatient**: `fhir.Patient` \| [`FetchResponse`](interfaces/FetchResponse.md)<`fhir.Patient`\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L4)

___

### DateInput

Ƭ **DateInput**: `string` \| `number` \| `Date`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L19)

___

### ExtensionSlotProps

Ƭ **ExtensionSlotProps**: [`ExtensionSlotBaseProps`](interfaces/ExtensionSlotBaseProps.md) & `React.HTMLAttributes`<`HTMLDivElement`\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:48](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L48)

___

### FormatDateMode

Ƭ **FormatDateMode**: ``"standard"`` \| ``"no year"`` \| ``"no day"`` \| ``"wide"``

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:154](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L154)

___

### FormatDateOptions

Ƭ **FormatDateOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `time` | `boolean` \| ``"for today"`` | Whether the time should be included in the output always (`true`), never (`false`), or only when the input date is today (`for today`). |

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:156](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L156)

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

### MaybeAsync

Ƭ **MaybeAsync**<`T`\>: `T` \| `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/framework/esm-extensions/src/store.ts:83](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L83)

___

### NavigationContextType

Ƭ **NavigationContextType**: ``"workspace"`` \| ``"dialog"`` \| ``"link"``

#### Defined in

[packages/framework/esm-extensions/src/contexts.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L3)

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

### PatientUuid

Ƭ **PatientUuid**: `string` \| ``null``

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L18)

___

### ProcessSyncItem

Ƭ **ProcessSyncItem**<`T`\>: (`item`: `T`, `options`: [`SyncProcessOptions`](interfaces/SyncProcessOptions.md)<`T`\>) => `Promise`<`any`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`item`, `options`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |
| `options` | [`SyncProcessOptions`](interfaces/SyncProcessOptions.md)<`T`\> |

##### Returns

`Promise`<`any`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L28)

___

### ProvidedConfig

Ƭ **ProvidedConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](interfaces/Config.md) |
| `source` | `string` |

#### Defined in

[packages/framework/esm-config/src/types.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L55)

___

### SpaEnvironment

Ƭ **SpaEnvironment**: ``"production"`` \| ``"development"`` \| ``"test"``

#### Defined in

[packages/framework/esm-globals/src/types.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L53)

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

[packages/framework/esm-config/src/types.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L62)

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

[packages/framework/esm-config/src/types.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L60)

## API Variables

### fhir

• `Const` **fhir**: `FhirClient`

The `fhir` object is [an instance of fhir.js](https://github.com/FHIR/fhir.js)
that can be used to call FHIR-compliant OpenMRS APIs. See
[the docs for fhir.js](https://github.com/FHIR/fhir.js) for more info
and example usage.

#### Defined in

[packages/framework/esm-api/src/fhir.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/fhir.ts#L41)

___

## Navigation Variables

### ConfigurableLink

• `Const` **ConfigurableLink**: `React.FC`<[`ConfigurableLinkProps`](interfaces/ConfigurableLinkProps.md)\>

A React link component which calls [navigate](API.md#navigate) when clicked

**`param`** The target path or URL. Supports interpolation. See [navigate](API.md#navigate)

**`param`** Inline elements within the link

**`param`** Any other valid props for an <a> tag except `href` and `onClick`

#### Defined in

[packages/framework/esm-react-utils/src/ConfigurableLink.tsx:32](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ConfigurableLink.tsx#L32)

___

## Other Variables

### ComponentContext

• `Const` **ComponentContext**: `Context`<[`ComponentConfig`](interfaces/ComponentConfig.md)\>

Available to all components. Provided by `openmrsComponentDecorator`.

#### Defined in

[packages/framework/esm-react-utils/src/ComponentContext.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ComponentContext.ts#L17)

___

### Extension

• `Const` **Extension**: `React.FC`<[`ExtensionProps`](interfaces/ExtensionProps.md)\>

Represents the position in the DOM where each extension within
an extension slot is rendered.

Renders once for each extension attached to that extension slot.

Usage of this component *must* have an ancestor `<ExtensionSlot>`,
and *must* only be used once within that `<ExtensionSlot>`.

#### Defined in

[packages/framework/esm-react-utils/src/Extension.tsx:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/Extension.tsx#L22)

___

### ExtensionSlot

• `Const` **ExtensionSlot**: `React.FC`<[`ExtensionSlotProps`](API.md#extensionslotprops)\>

#### Defined in

[packages/framework/esm-react-utils/src/ExtensionSlot.tsx:51](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L51)

___

### UserHasAccess

• `Const` **UserHasAccess**: `React.FC`<[`UserHasAccessProps`](interfaces/UserHasAccessProps.md)\>

#### Defined in

[packages/framework/esm-react-utils/src/UserHasAccess.tsx:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/UserHasAccess.tsx#L8)

___

### backendDependencies

• `Const` **backendDependencies**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fhir2` | `string` |
| `webservices.rest` | `string` |

#### Defined in

[packages/framework/esm-api/src/openmrs-backend-dependencies.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-backend-dependencies.ts#L1)

___

### extensionStore

• `Const` **extensionStore**: `Store`<[`ExtensionStore`](interfaces/ExtensionStore.md)\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L78)

___

### fhirBaseUrl

• `Const` **fhirBaseUrl**: ``"/ws/fhir2/R4"``

#### Defined in

[packages/framework/esm-api/src/fhir.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/fhir.ts#L4)

___

### getStartedVisit

• `Const` **getStartedVisit**: `BehaviorSubject`<``null`` \| [`VisitItem`](interfaces/VisitItem.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L84)

___

### implementerToolsConfigStore

• `Const` **implementerToolsConfigStore**: `Store`<[`ImplementerToolsConfigStore`](interfaces/ImplementerToolsConfigStore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:182](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L182)

___

### offlineUuidPrefix

• `Const` **offlineUuidPrefix**: ``"OFFLINE+"``

#### Defined in

[packages/framework/esm-offline/src/uuid.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/uuid.ts#L3)

___

### omrsOfflineCachingStrategyHttpHeaderName

• `Const` **omrsOfflineCachingStrategyHttpHeaderName**: ``"x-omrs-offline-caching-strategy"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L5)

___

### omrsOfflineResponseBodyHttpHeaderName

• `Const` **omrsOfflineResponseBodyHttpHeaderName**: ``"x-omrs-offline-response-body"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L1)

___

### omrsOfflineResponseStatusHttpHeaderName

• `Const` **omrsOfflineResponseStatusHttpHeaderName**: ``"x-omrs-offline-response-status"``

#### Defined in

[packages/framework/esm-offline/src/service-worker-http-headers.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L3)

___

### sessionEndpoint

• `Const` **sessionEndpoint**: ``"/ws/rest/v1/session"``

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L6)

___

### temporaryConfigStore

• `Const` **temporaryConfigStore**: `Store`<`TemporaryConfigStore`\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L69)

___

### validators

• `Const` **validators**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inRange` | (`min`: `number`, `max`: `number`) => [`Validator`](API.md#validator) |
| `isUrl` | [`Validator`](API.md#validator) |
| `isUrlWithTemplateParameters` | (`allowedTemplateParameters`: `string`[]) => [`Validator`](API.md#validator) |

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L57)

## API Functions

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

[packages/framework/esm-api/src/openmrs-fetch.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L61)

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

[packages/framework/esm-api/src/openmrs-fetch.ts:232](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L232)

___

## API Object Functions

### fetchCurrentPatient

▸ **fetchCurrentPatient**(`patientUuid`, `contentOverrides?`): `Promise`<`Object`\> \| `Promise`<``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | [`PatientUuid`](API.md#patientuuid) |
| `contentOverrides?` | `Partial`<`Parameters`<typeof `fhir.read`\>[``0``]\> |

#### Returns

`Promise`<`Object`\> \| `Promise`<``null``\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-patient.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L23)

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

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L57)

▸ **getCurrentUser**(`opts`): `Observable`<[`UnauthenticatedUser`](interfaces/UnauthenticatedUser.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CurrentUserWithResponseOption`](interfaces/CurrentUserWithResponseOption.md) |

#### Returns

`Observable`<[`UnauthenticatedUser`](interfaces/UnauthenticatedUser.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L58)

▸ **getCurrentUser**(`opts`): `Observable`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CurrentUserWithoutResponseOption`](interfaces/CurrentUserWithoutResponseOption.md) |

#### Returns

`Observable`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L61)

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

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:116](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L116)

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

[packages/framework/esm-config/src/navigation/interpolate-string.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/interpolate-string.ts#L38)

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

▸ **navigate**(`__namedParameters`): `void`

Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths

Example usage:
```js
const config = getConfig();
const submitHandler = () => {
  navigate({ to: config.links.submitSuccess });
};
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`NavigateOptions`](interfaces/NavigateOptions.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/navigation/navigate.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/navigate.ts#L29)

___

## Other Functions

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

▸ **attach**(`extensionSlotName`, `extensionId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |
| `extensionId` | `string` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L75)

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

[packages/framework/esm-config/src/module-config/module-config.ts:172](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L172)

___

### deleteSynchronizationItem

▸ **deleteSynchronizationItem**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:251](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L251)

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

[packages/framework/esm-extensions/src/extensions.ts:105](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L105)

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

[packages/framework/esm-extensions/src/extensions.ts:128](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L128)

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

### formatDate

▸ **formatDate**(`date`, `mode?`, `options?`): `string`

Formats the input date according to the current locale and the
given format mode.

- `standard`: "13 Dec 2021"
- `no year`:  "13 Dec"
- `no day`:   "Dec 2021"
- `wide`:     "13 — Dec — 2021"

Regardless of the mode, if the date is today, then "Today" is produced
(in the locale language).

Can be used to format a date with time, also, by providing `options`.
By default, the time is included only when the input date is today.
The time is appended with a comma and a space. This agrees with the
output of `Date.prototype.toLocaleString` for *most* locales.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | `Date` | `undefined` |
| `mode` | [`FormatDateMode`](API.md#formatdatemode) | `"standard"` |
| `options` | [`FormatDateOptions`](API.md#formatdateoptions) | `undefined` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:184](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L184)

___

### formatDatetime

▸ **formatDatetime**(`date`, `mode?`): `string`

Formats the input into a string showing the date and time, according
to the current locale. The `mode` parameter is as described for
`formatDate`.

This is created by concatenating the results of `formatDate`
and `formatTime` with a comma and space. This agrees with the
output of `Date.prototype.toLocaleString` for *most* locales.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | `Date` | `undefined` |
| `mode` | [`FormatDateMode`](API.md#formatdatemode) | `"standard"` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/omrs-dates.ts:254](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L254)

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

[packages/framework/esm-utils/src/omrs-dates.ts:238](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L238)

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

### getAssignedIds

▸ **getAssignedIds**(`slotName`, `config`, `attachedIds`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `slotName` | `string` |
| `config` | [`ExtensionSlotConfigObject`](interfaces/ExtensionSlotConfigObject.md) |
| `attachedIds` | `string`[] |

#### Returns

`string`[]

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:178](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L178)

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
| `lazy` | () => `Promise`<`Object`\> |
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
| `lazy` | () => `Promise`<`Object`\> |
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

[packages/framework/esm-config/src/module-config/module-config.ts:200](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L200)

___

### getConfigStore

▸ **getConfigStore**(`moduleName`): `Store`<[`ConfigStore`](interfaces/ConfigStore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`Store`<[`ConfigStore`](interfaces/ConfigStore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:136](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L136)

___

### getCustomProps

▸ **getCustomProps**(`online`, `offline`): `object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `online` | `boolean` \| `object` \| `undefined` |
| `offline` | `boolean` \| `object` \| `undefined` |

#### Returns

`object`

#### Defined in

[packages/framework/esm-extensions/src/helpers.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L17)

___

### getExtensionConfigStore

▸ **getExtensionConfigStore**(`extensionSlotModuleName`, `attachedExtensionSlotName`, `extensionId`): `Store`<[`ConfigStore`](interfaces/ConfigStore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotModuleName` | `string` |
| `attachedExtensionSlotName` | `string` |
| `extensionId` | `string` |

#### Returns

`Store`<[`ConfigStore`](interfaces/ConfigStore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:166](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L166)

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

[packages/framework/esm-extensions/src/extensions.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L33)

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

[packages/framework/esm-extensions/src/extensions.ts:46](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L46)

___

### getExtensionRegistrationFrom

▸ **getExtensionRegistrationFrom**(`state`, `extensionId`): [`ExtensionRegistration`](interfaces/ExtensionRegistration.md) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ExtensionStore`](interfaces/ExtensionStore.md) |
| `extensionId` | `string` |

#### Returns

[`ExtensionRegistration`](interfaces/ExtensionRegistration.md) \| `undefined`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L38)

___

### getExtensionSlotsConfigStore

▸ **getExtensionSlotsConfigStore**(`moduleName`): `Store`<[`ExtensionSlotConfigsStore`](interfaces/ExtensionSlotConfigsStore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`Store`<[`ExtensionSlotConfigsStore`](interfaces/ExtensionSlotConfigsStore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:157](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L157)

___

### getExtensionSlotsForModule

▸ **getExtensionSlotsForModule**(`moduleName`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`string`[]

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:303](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L303)

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
| `Component` | `React.ComponentType`<`T`\> |
| `options` | [`ComponentDecoratorOptions`](interfaces/ComponentDecoratorOptions.md) |

#### Returns

`ReactAppOrParcel`<`any`\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L9)

___

### getLocations

▸ **getLocations**(): `Observable`<[`Location`](interfaces/Location.md)[]\>

#### Returns

`Observable`<[`Location`](interfaces/Location.md)[]\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/location.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/location.ts#L13)

___

### getLoggedInUser

▸ **getLoggedInUser**(): `Promise`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Returns

`Promise`<[`LoggedInUser`](interfaces/LoggedInUser.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:134](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L134)

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

[packages/framework/esm-offline/src/sync.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L80)

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

### getSessionLocation

▸ **getSessionLocation**(): `Promise`<`undefined` \| [`SessionLocation`](interfaces/SessionLocation.md)\>

#### Returns

`Promise`<`undefined` \| [`SessionLocation`](interfaces/SessionLocation.md)\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:143](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L143)

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
| `Component` | `React.ComponentType`<`T`\> |
| `options` | [`ComponentDecoratorOptions`](interfaces/ComponentDecoratorOptions.md) |

#### Returns

`fn`

▸ (): `Promise`<`ReactAppOrParcel`<`any`\>\>

##### Returns

`Promise`<`ReactAppOrParcel`<`any`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/getLifecycle.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L28)

___

### getSynchronizationItems

▸ **getSynchronizationItems**<`T`\>(`type`): `Promise`<`T`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:246](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L246)

___

### getSynchronizationItemsFor

▸ **getSynchronizationItemsFor**<`T`\>(`userId`, `type`): `Promise`<`T`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `type` | `string` |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:232](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L232)

___

### getUpdatedExtensionSlotInfo

▸ **getUpdatedExtensionSlotInfo**(`slotName`, `moduleName`, `extensionSlot`): [`ExtensionSlotInfo`](interfaces/ExtensionSlotInfo.md)

Returns information describing all extensions which can be rendered into an extension slot with
the specified name.
The returned information describe the extension itself, as well as the extension slot name(s)
with which it has been attached.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` | The extension slot name for which matching extension info should be returned. |
| `moduleName` | `string` | The module name. Used for applying extension-specific config values to the result. |
| `extensionSlot` | [`ExtensionSlotInfo`](interfaces/ExtensionSlotInfo.md) | The extension slot information object. |

#### Returns

[`ExtensionSlotInfo`](interfaces/ExtensionSlotInfo.md)

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:330](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L330)

___

### getVisitTypes

▸ **getVisitTypes**(): `Observable`<[`VisitType`](interfaces/VisitType.md)[]\>

#### Returns

`Observable`<[`VisitType`](interfaces/VisitType.md)[]\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-type.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-type.ts#L14)

___

### getVisitsForPatient

▸ **getVisitsForPatient**(`patientUuid`, `abortController`, `v?`): `Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<`Object`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | `string` |
| `abortController` | `AbortController` |
| `v?` | `string` |

#### Returns

`Observable`<[`FetchResponse`](interfaces/FetchResponse.md)<`Object`\>\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L23)

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

### makeUrl

▸ **makeUrl**(`path`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-api/src/openmrs-fetch.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L8)

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

### openVisitsNoteWorkspace

▸ **openVisitsNoteWorkspace**(`componentName`, `title`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |
| `title` | `string` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L12)

___

### openmrsComponentDecorator

▸ **openmrsComponentDecorator**(`userOpts`): (`Comp`: `ComponentType`<`Object`\>) => `ComponentType`<`any`\>

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
| `Comp` | `ComponentType`<`Object`\> |

##### Returns

`ComponentType`<`any`\>

#### Defined in

[packages/framework/esm-react-utils/src/openmrsComponentDecorator.tsx:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/openmrsComponentDecorator.tsx#L71)

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

[packages/framework/esm-config/src/module-config/module-config.ts:222](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L222)

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

[packages/framework/esm-config/src/module-config/module-config.ts:180](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L180)

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

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `content` | `T` |
| `descriptor?` | [`QueueItemDescriptor`](interfaces/QueueItemDescriptor.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:223](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L223)

___

### queueSynchronizationItemFor

▸ **queueSynchronizationItemFor**<`T`\>(`userId`, `type`, `content`, `descriptor?`): `Promise`<`number`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `type` | `string` |
| `content` | `T` |
| `descriptor?` | [`QueueItemDescriptor`](interfaces/QueueItemDescriptor.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:195](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L195)

___

### registerExtension

▸ `Const` **registerExtension**(`name`, `details`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `details` | [`ExtensionDetails`](interfaces/ExtensionDetails.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L62)

___

### registerExtensionSlot

▸ **registerExtensionSlot**(`moduleName`, `slotName`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` | The name of the module that contains the extension slot |
| `slotName` | `string` | The extension slot name that is actually used |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:256](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L256)

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

[packages/framework/esm-extensions/src/render.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/render.ts#L23)

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
| `modalContainer` | `HTMLElement` \| ``null`` |

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
| `target` | `HTMLElement` \| ``null`` | The container target that hosts the toast notifications. |

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

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/sync.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L84)

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

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L55)

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

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:155](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L155)

___

### setupOfflineSync

▸ **setupOfflineSync**<`T`\>(`type`, `dependsOn`, `process`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `dependsOn` | `string`[] |
| `process` | [`ProcessSyncItem`](API.md#processsyncitem)<`T`\> |

#### Returns

`void`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:263](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L263)

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

### toLocationObject

▸ **toLocationObject**(`openmrsRestForm`): [`Location`](interfaces/Location.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `openmrsRestForm` | `any` |

#### Returns

[`Location`](interfaces/Location.md)

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/location.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/location.ts#L6)

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

### toVisitTypeObject

▸ **toVisitTypeObject**(`openmrsRestForm`): [`VisitType`](interfaces/VisitType.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `openmrsRestForm` | `any` |

#### Returns

[`VisitType`](interfaces/VisitType.md)

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-type.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-type.ts#L6)

___

### translateFrom

▸ **translateFrom**(`moduleName`, `key`, `fallback?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |
| `key` | `string` |
| `fallback?` | `string` |

#### Returns

`string`

#### Defined in

[packages/framework/esm-utils/src/translate.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/translate.ts#L3)

___

### unregisterExtensionSlot

▸ **unregisterExtensionSlot**(`moduleName`, `slotName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |
| `slotName` | `string` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/extensions.ts:279](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L279)

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

### updateExtensionStore

▸ **updateExtensionStore**(`updater`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `updater` | (`state`: [`ExtensionStore`](interfaces/ExtensionStore.md)) => [`MaybeAsync`](API.md#maybeasync)<[`ExtensionStore`](interfaces/ExtensionStore.md)\> |

#### Returns

`void`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:87](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L87)

___

### updateVisit

▸ **updateVisit**(`uuid`, `payload`, `abortController`): `Observable`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |
| `payload` | [`UpdateVisitPayload`](API.md#updatevisitpayload) |
| `abortController` | `AbortController` |

#### Returns

`Observable`<`any`\>

#### Defined in

[packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L69)

___

### useAssignedExtensionIds

▸ **useAssignedExtensionIds**(`extensionSlotName`): `string`[]

Gets the assigned extension ids for a given extension slot name.
Does not consider if offline or online.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionSlotName` | `string` | The name of the slot to get the assigned IDs for. |

#### Returns

`string`[]

#### Defined in

[packages/framework/esm-react-utils/src/useAssignedExtensionIds.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useAssignedExtensionIds.ts#L11)

___

### useAttachedExtensionIds

▸ **useAttachedExtensionIds**(`extensionSlotName`): `string`[]

Gets the assigned extension ids for the given slot.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |

#### Returns

`string`[]

#### Defined in

[packages/framework/esm-react-utils/src/useAttachedExtensionIds.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useAttachedExtensionIds.ts#L11)

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
| `hasOwnProperty` | (`v`: `PropertyKey`) => `boolean` | - |
| `isPrototypeOf` | (`v`: `Object`) => `boolean` | - |
| `propertyIsEnumerable` | (`v`: `PropertyKey`) => `boolean` | - |
| `toLocaleString` | () => `string` | - |
| `toString` | () => `string` | - |
| `valueOf` | () => `Object` | - |

#### Defined in

[packages/framework/esm-react-utils/src/useConfig.ts:103](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConfig.ts#L103)

___

### useConnectedExtensions

▸ **useConnectedExtensions**(`extensionSlotName`): [`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

Gets the assigned extension for a given extension slot name.
Considers if offline or online.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionSlotName` | `string` | The name of the slot to get the assigned extensions for. |

#### Returns

[`ConnectedExtension`](interfaces/ConnectedExtension.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useConnectedExtensions.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConnectedExtensions.ts#L36)

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | [`PatientUuid`](API.md#patientuuid) |

#### Returns

[`boolean`, `NullablePatient`, [`PatientUuid`](API.md#patientuuid), `Error` \| ``null``]

#### Defined in

[packages/framework/esm-react-utils/src/useCurrentPatient.ts:79](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useCurrentPatient.ts#L79)

___

### useExtension

▸ **useExtension**<`TRef`\>(`state?`): [`RefObject`<`TRef`\>, [`ExtensionData`](interfaces/ExtensionData.md) \| `undefined`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRef` | extends `HTMLElement` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `state?` | `Record`<`string`, `any`\> |

#### Returns

[`RefObject`<`TRef`\>, [`ExtensionData`](interfaces/ExtensionData.md) \| `undefined`]

#### Defined in

[packages/framework/esm-react-utils/src/useExtension.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtension.ts#L5)

___

### useExtensionSlot

▸ **useExtensionSlot**(`extensionSlotName`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `extensionSlotModuleName` | `string` |
| `extensionSlotName` | `string` |
| `extensions` | [`ConnectedExtension`](interfaces/ConnectedExtension.md)[] |

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionSlot.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionSlot.ts#L9)

___

### useExtensionSlotConfig

▸ **useExtensionSlotConfig**(`extensionSlotName`): [`ExtensionSlotConfigObject`](interfaces/ExtensionSlotConfigObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |

#### Returns

[`ExtensionSlotConfigObject`](interfaces/ExtensionSlotConfigObject.md)

#### Defined in

[packages/framework/esm-react-utils/src/useExtensionSlotConfig.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionSlotConfig.ts#L16)

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
| `T` | extends `HTMLElement``HTMLElement` |

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
| `resultsPerPage` | `number` | `undefined` |

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

▸ **useVisit**(`patientUuid`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `currentVisit` | ``null`` \| [`Visit`](interfaces/Visit.md) |
| `error` | ``null`` |

#### Defined in

[packages/framework/esm-react-utils/src/useVisit.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useVisit.ts#L11)

___

### useVisitTypes

▸ **useVisitTypes**(): [`VisitType`](interfaces/VisitType.md)[]

#### Returns

[`VisitType`](interfaces/VisitType.md)[]

#### Defined in

[packages/framework/esm-react-utils/src/useVisitTypes.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useVisitTypes.ts#L4)

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

[packages/framework/esm-api/src/shared-api-objects/current-user.ts:130](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L130)

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

___

## Workspace Functions

### getNewWorkspaceItem

▸ **getNewWorkspaceItem**(): `Observable`<[`WorkspaceItem`](interfaces/WorkspaceItem.md)\>

#### Returns

`Observable`<[`WorkspaceItem`](interfaces/WorkspaceItem.md)\>

#### Defined in

[packages/framework/esm-api/src/workspace/workspace.resource.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/workspace/workspace.resource.tsx#L19)

___

### newWorkspaceItem

▸ **newWorkspaceItem**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`WorkspaceItem`](interfaces/WorkspaceItem.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-api/src/workspace/workspace.resource.tsx:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/workspace/workspace.resource.tsx#L10)
