[Back to README.md](../README.md)

# @openmrs/esm-framework

## Table of contents

### Enumerations

- [Type](enums/type.md)
- [VisitMode](enums/visitmode.md)
- [VisitStatus](enums/visitstatus.md)

### Classes

- [OpenmrsFetchError](classes/openmrsfetcherror.md)

### Interfaces

- [AppState](interfaces/appstate.md)
- [BreadcrumbRegistration](interfaces/breadcrumbregistration.md)
- [BreadcrumbSettings](interfaces/breadcrumbsettings.md)
- [CancelLoading](interfaces/cancelloading.md)
- [ClearDynamicRoutesMessage](interfaces/cleardynamicroutesmessage.md)
- [ComponentConfig](interfaces/componentconfig.md)
- [ComponentDecoratorOptions](interfaces/componentdecoratoroptions.md)
- [ComponentDefinition](interfaces/componentdefinition.md)
- [Config](interfaces/config.md)
- [ConfigObject](interfaces/configobject.md)
- [ConfigSchema](interfaces/configschema.md)
- [ConfigStore](interfaces/configstore.md)
- [ConfigurableLinkProps](interfaces/configurablelinkprops.md)
- [ConnectivityChangedEvent](interfaces/connectivitychangedevent.md)
- [CurrentPatientOptions](interfaces/currentpatientoptions.md)
- [CurrentUserOptions](interfaces/currentuseroptions.md)
- [CurrentUserWithResponseOption](interfaces/currentuserwithresponseoption.md)
- [CurrentUserWithoutResponseOption](interfaces/currentuserwithoutresponseoption.md)
- [ExtensionData](interfaces/extensiondata.md)
- [ExtensionDetails](interfaces/extensiondetails.md)
- [ExtensionInfo](interfaces/extensioninfo.md)
- [ExtensionInstance](interfaces/extensioninstance.md)
- [ExtensionMeta](interfaces/extensionmeta.md)
- [ExtensionProps](interfaces/extensionprops.md)
- [ExtensionRegistration](interfaces/extensionregistration.md)
- [ExtensionSlotBaseProps](interfaces/extensionslotbaseprops.md)
- [ExtensionSlotConfig](interfaces/extensionslotconfig.md)
- [ExtensionSlotConfigObject](interfaces/extensionslotconfigobject.md)
- [ExtensionSlotConfigsStore](interfaces/extensionslotconfigsstore.md)
- [ExtensionSlotConfigureValueObject](interfaces/extensionslotconfigurevalueobject.md)
- [ExtensionSlotInfo](interfaces/extensionslotinfo.md)
- [ExtensionSlotInstance](interfaces/extensionslotinstance.md)
- [ExtensionStore](interfaces/extensionstore.md)
- [FHIRCode](interfaces/fhircode.md)
- [FHIRRequestObj](interfaces/fhirrequestobj.md)
- [FHIRResource](interfaces/fhirresource.md)
- [FetchHeaders](interfaces/fetchheaders.md)
- [FetchResponse](interfaces/fetchresponse.md)
- [ImplementerToolsConfigStore](interfaces/implementertoolsconfigstore.md)
- [ImportMap](interfaces/importmap.md)
- [LegacyAppExtensionDefinition](interfaces/legacyappextensiondefinition.md)
- [Lifecycle](interfaces/lifecycle.md)
- [Location](interfaces/location.md)
- [LoggedInUser](interfaces/loggedinuser.md)
- [LoggedInUserFetchResponse](interfaces/loggedinuserfetchresponse.md)
- [MessageServiceWorkerResult](interfaces/messageserviceworkerresult.md)
- [ModernAppExtensionDefinition](interfaces/modernappextensiondefinition.md)
- [NavigateOptions](interfaces/navigateoptions.md)
- [NavigationContext](interfaces/navigationcontext.md)
- [NetworkRequestFailedEvent](interfaces/networkrequestfailedevent.md)
- [NewVisitPayload](interfaces/newvisitpayload.md)
- [OfflineStore](interfaces/offlinestore.md)
- [OmrsServiceWorkerEvent](interfaces/omrsserviceworkerevent.md)
- [OmrsServiceWorkerMessage](interfaces/omrsserviceworkermessage.md)
- [OnImportMapChangedMessage](interfaces/onimportmapchangedmessage.md)
- [OnlyThePatient](interfaces/onlythepatient.md)
- [OpenmrsReactComponentProps](interfaces/openmrsreactcomponentprops.md)
- [OpenmrsReactComponentState](interfaces/openmrsreactcomponentstate.md)
- [OpenmrsResource](interfaces/openmrsresource.md)
- [PageDefinition](interfaces/pagedefinition.md)
- [PatientWithFullResponse](interfaces/patientwithfullresponse.md)
- [Person](interfaces/person.md)
- [Privilege](interfaces/privilege.md)
- [RegisterDynamicRouteMessage](interfaces/registerdynamicroutemessage.md)
- [ResourceLoader](interfaces/resourceloader.md)
- [Role](interfaces/role.md)
- [SessionUser](interfaces/sessionuser.md)
- [ShowNotificationEvent](interfaces/shownotificationevent.md)
- [SpaConfig](interfaces/spaconfig.md)
- [UnauthenticatedUser](interfaces/unauthenticateduser.md)
- [User](interfaces/user.md)
- [UserHasAccessProps](interfaces/userhasaccessprops.md)
- [Visit](interfaces/visit.md)
- [VisitItem](interfaces/visititem.md)
- [VisitType](interfaces/visittype.md)
- [WorkspaceItem](interfaces/workspaceitem.md)

### Type aliases

- [Actions](API.md#actions)
- [AppExtensionDefinition](API.md#appextensiondefinition)
- [BoundActions](API.md#boundactions)
- [ConfigValue](API.md#configvalue)
- [CurrentPatient](API.md#currentpatient)
- [DateInput](API.md#dateinput)
- [ExtensionSlotProps](API.md#extensionslotprops)
- [KnownOmrsServiceWorkerEvents](API.md#knownomrsserviceworkerevents)
- [KnownOmrsServiceWorkerMessages](API.md#knownomrsserviceworkermessages)
- [LayoutType](API.md#layouttype)
- [MaybeAsync](API.md#maybeasync)
- [NavigationContextType](API.md#navigationcontexttype)
- [PatientUuid](API.md#patientuuid)
- [ProvidedConfig](API.md#providedconfig)
- [SpaEnvironment](API.md#spaenvironment)
- [SynchronizeCallback](API.md#synchronizecallback)
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
- [createAppState](API.md#createappstate)
- [createErrorHandler](API.md#createerrorhandler)
- [createGlobalStore](API.md#createglobalstore)
- [createUseStore](API.md#createusestore)
- [daysIntoYear](API.md#daysintoyear)
- [defineConfigSchema](API.md#defineconfigschema)
- [detach](API.md#detach)
- [detachAll](API.md#detachall)
- [dispatchConnectivityChanged](API.md#dispatchconnectivitychanged)
- [dispatchNetworkRequestFailed](API.md#dispatchnetworkrequestfailed)
- [dispatchNotificationShown](API.md#dispatchnotificationshown)
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
- [getOmrsServiceWorker](API.md#getomrsserviceworker)
- [getSyncLifecycle](API.md#getsynclifecycle)
- [getSynchronizationCallbacks](API.md#getsynchronizationcallbacks)
- [getUpdatedExtensionSlotInfo](API.md#getupdatedextensionslotinfo)
- [getVisitTypes](API.md#getvisittypes)
- [getVisitsForPatient](API.md#getvisitsforpatient)
- [handleApiError](API.md#handleapierror)
- [inRange](API.md#inrange)
- [integrateBreakpoints](API.md#integratebreakpoints)
- [isOmrsDateStrict](API.md#isomrsdatestrict)
- [isOmrsDateToday](API.md#isomrsdatetoday)
- [isSameDay](API.md#issameday)
- [makeUrl](API.md#makeurl)
- [messageOmrsServiceWorker](API.md#messageomrsserviceworker)
- [openVisitsNoteWorkspace](API.md#openvisitsnoteworkspace)
- [openmrsComponentDecorator](API.md#openmrscomponentdecorator)
- [processConfig](API.md#processconfig)
- [provide](API.md#provide)
- [pushNavigationContext](API.md#pushnavigationcontext)
- [registerExtension](API.md#registerextension)
- [registerExtensionSlot](API.md#registerextensionslot)
- [registerOmrsServiceWorker](API.md#registeromrsserviceworker)
- [registerSynchronizationCallback](API.md#registersynchronizationcallback)
- [renderExtension](API.md#renderextension)
- [renderLoadingSpinner](API.md#renderloadingspinner)
- [renderNotifications](API.md#rendernotifications)
- [reportError](API.md#reporterror)
- [saveVisit](API.md#savevisit)
- [setupPaths](API.md#setuppaths)
- [setupUtils](API.md#setuputils)
- [showNotification](API.md#shownotification)
- [subscribeConnectivity](API.md#subscribeconnectivity)
- [subscribeConnectivityChanged](API.md#subscribeconnectivitychanged)
- [subscribeNetworkRequestFailed](API.md#subscribenetworkrequestfailed)
- [subscribeNotificationShown](API.md#subscribenotificationshown)
- [subscribeTo](API.md#subscribeto)
- [switchTo](API.md#switchto)
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

Ƭ **Actions**: Function \| { [key: string]: Function;  }

Defined in: [packages/framework/esm-react-utils/src/createUseStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/createUseStore.ts#L4)

___

### AppExtensionDefinition

Ƭ **AppExtensionDefinition**: [*ModernAppExtensionDefinition*](interfaces/modernappextensiondefinition.md) & [*LegacyAppExtensionDefinition*](interfaces/legacyappextensiondefinition.md)

Defined in: [packages/framework/esm-globals/src/types.ts:126](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L126)

___

### BoundActions

Ƭ **BoundActions**: *object*

#### Type declaration

Defined in: [packages/framework/esm-react-utils/src/createUseStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/createUseStore.ts#L5)

___

### ConfigValue

Ƭ **ConfigValue**: *string* \| *number* \| *boolean* \| *void* \| *any*[] \| *object*

Defined in: [packages/framework/esm-config/src/types.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L30)

___

### CurrentPatient

Ƭ **CurrentPatient**: fhir.Patient \| [*FetchResponse*](interfaces/fetchresponse.md)<fhir.Patient\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/current-patient.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L4)

___

### DateInput

Ƭ **DateInput**: *string* \| *number* \| Date

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L8)

___

### ExtensionSlotProps

Ƭ **ExtensionSlotProps**: [*ExtensionSlotBaseProps*](interfaces/extensionslotbaseprops.md) & *React.HTMLAttributes*<HTMLDivElement\>

Defined in: [packages/framework/esm-react-utils/src/ExtensionSlot.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L19)

___

### KnownOmrsServiceWorkerEvents

Ƭ **KnownOmrsServiceWorkerEvents**: [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md)

Defined in: [packages/framework/esm-offline/src/service-worker-events.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L15)

___

### KnownOmrsServiceWorkerMessages

Ƭ **KnownOmrsServiceWorkerMessages**: [*OnImportMapChangedMessage*](interfaces/onimportmapchangedmessage.md) \| [*ClearDynamicRoutesMessage*](interfaces/cleardynamicroutesmessage.md) \| [*RegisterDynamicRouteMessage*](interfaces/registerdynamicroutemessage.md)

Defined in: [packages/framework/esm-offline/src/service-worker-messaging.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L36)

___

### LayoutType

Ƭ **LayoutType**: ``"tablet"`` \| ``"phone"`` \| ``"desktop"``

Defined in: [packages/framework/esm-react-utils/src/useLayoutType.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useLayoutType.ts#L3)

___

### MaybeAsync

Ƭ **MaybeAsync**<T\>: T \| *Promise*<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

Defined in: [packages/framework/esm-extensions/src/store.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L81)

___

### NavigationContextType

Ƭ **NavigationContextType**: ``"workspace"`` \| ``"dialog"`` \| ``"link"``

Defined in: [packages/framework/esm-extensions/src/contexts.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L3)

___

### PatientUuid

Ƭ **PatientUuid**: *string* \| ``null``

Defined in: [packages/framework/esm-api/src/shared-api-objects/current-patient.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L18)

___

### ProvidedConfig

Ƭ **ProvidedConfig**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [*Config*](interfaces/config.md) |
| `source` | *string* |

Defined in: [packages/framework/esm-config/src/types.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L55)

___

### SpaEnvironment

Ƭ **SpaEnvironment**: ``"production"`` \| ``"development"`` \| ``"test"``

Defined in: [packages/framework/esm-globals/src/types.ts:47](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L47)

___

### SynchronizeCallback

Ƭ **SynchronizeCallback**: () => *Promise*<void\>

#### Type declaration

▸ (): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [packages/framework/esm-offline/src/store.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/store.ts#L3)

___

### UpdateVisitPayload

Ƭ **UpdateVisitPayload**: [*NewVisitPayload*](interfaces/newvisitpayload.md) & {}

Defined in: [packages/framework/esm-api/src/types/visit-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/visit-resource.ts#L11)

___

### Validator

Ƭ **Validator**: (`value`: *any*) => *void* \| *string*

#### Type declaration

▸ (`value`: *any*): *void* \| *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *any* |

**Returns:** *void* \| *string*

Defined in: [packages/framework/esm-config/src/types.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L62)

___

### ValidatorFunction

Ƭ **ValidatorFunction**: (`value`: *any*) => *boolean*

#### Type declaration

▸ (`value`: *any*): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *any* |

**Returns:** *boolean*

Defined in: [packages/framework/esm-config/src/types.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L60)

## API Variables

### fhir

• `Const` **fhir**: FhirClient

The `fhir` object is [an instance of fhir.js](https://github.com/FHIR/fhir.js)
that can be used to call FHIR-compliant OpenMRS APIs. See
[the docs for fhir.js](https://github.com/FHIR/fhir.js) for more info
and example usage.

Defined in: [packages/framework/esm-api/src/fhir.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/fhir.ts#L41)

___

## Navigation Variables

### ConfigurableLink

• `Const` **ConfigurableLink**: *React.FC*<[*ConfigurableLinkProps*](interfaces/configurablelinkprops.md)\>

A React link component which calls [navigate](API.md#navigate) when clicked

**`param`** The target path or URL. Supports interpolation. See [navigate](API.md#navigate)

**`param`** Inline elements within the link

**`param`** Any other valid props for an <a> tag except `href` and `onClick`

Defined in: [packages/framework/esm-react-utils/src/ConfigurableLink.tsx:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ConfigurableLink.tsx#L29)

___

## Other Variables

### ComponentContext

• `Const` **ComponentContext**: *Context*<[*ComponentConfig*](interfaces/componentconfig.md)\>

Available to all components. Provided by `openmrsComponentDecorator`.

Defined in: [packages/framework/esm-react-utils/src/ComponentContext.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ComponentContext.ts#L17)

___

### Extension

• `Const` **Extension**: *React.FC*<[*ExtensionProps*](interfaces/extensionprops.md)\>

Represents the position in the DOM where each extension within
an extension slot is rendered.

Renders once for each extension attached to that extension slot.

Usage of this component *must* have an ancestor `<ExtensionSlot>`.

Defined in: [packages/framework/esm-react-utils/src/Extension.tsx:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/Extension.tsx#L21)

___

### ExtensionSlot

• `Const` **ExtensionSlot**: *React.FC*<[*ExtensionSlotProps*](API.md#extensionslotprops)\>

Defined in: [packages/framework/esm-react-utils/src/ExtensionSlot.tsx:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L22)

___

### UserHasAccess

• `Const` **UserHasAccess**: *React.FC*<[*UserHasAccessProps*](interfaces/userhasaccessprops.md)\>

Defined in: [packages/framework/esm-react-utils/src/UserHasAccess.tsx:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/UserHasAccess.tsx#L8)

___

### backendDependencies

• `Const` **backendDependencies**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fhir2` | *string* |
| `webservices.rest` | *string* |

Defined in: [packages/framework/esm-api/src/openmrs-backend-dependencies.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-backend-dependencies.ts#L1)

___

### extensionStore

• `Const` **extensionStore**: *Store*<[*ExtensionStore*](interfaces/extensionstore.md)\>

Defined in: [packages/framework/esm-extensions/src/store.ts:76](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L76)

___

### fhirBaseUrl

• `Const` **fhirBaseUrl**: ``"/ws/fhir2/R4"``

Defined in: [packages/framework/esm-api/src/fhir.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/fhir.ts#L4)

___

### getStartedVisit

• `Const` **getStartedVisit**: *BehaviorSubject*<``null`` \| [*VisitItem*](interfaces/visititem.md)\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L84)

___

### implementerToolsConfigStore

• `Const` **implementerToolsConfigStore**: *Store*<[*ImplementerToolsConfigStore*](interfaces/implementertoolsconfigstore.md)\>

Defined in: [packages/framework/esm-config/src/module-config/state.ts:188](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L188)

___

### sessionEndpoint

• `Const` **sessionEndpoint**: ``"/ws/rest/v1/session"``= "/ws/rest/v1/session"

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L6)

___

### temporaryConfigStore

• `Const` **temporaryConfigStore**: *Store*<TemporaryConfigStore\>

Defined in: [packages/framework/esm-config/src/module-config/state.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L75)

___

### validators

• `Const` **validators**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inRange` | (`min`: *number*, `max`: *number*) => [*Validator*](API.md#validator) |
| `isUrl` | [*Validator*](API.md#validator) |
| `isUrlWithTemplateParameters` | (`allowedTemplateParameters`: *string*[]) => [*Validator*](API.md#validator) |

Defined in: [packages/framework/esm-config/src/validators/validators.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L57)

## API Functions

### openmrsFetch

▸ **openmrsFetch**<T\>(`path`: *string*, `fetchInit?`: FetchConfig): *Promise*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

The openmrsFetch function is a wrapper around the
[browser's built-in fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch),
with extra handling for OpenMRS-specific API behaviors, such as
request headers, authentication, authorization, and the API urls.

#### Type parameters

| Name | Default |
| :------ | :------ |
| `T` | *any* |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `path` | *string* | - | A string url to make the request to. Note that the   openmrs base url (by default `/openmrs`) will be automatically   prepended to the URL, so there is no need to include it. |
| `fetchInit` | FetchConfig | {} | A [fetch init object](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax).   Note that the `body` property does not need to be `JSON.stringify()`ed   because openmrsFetch will do that for you. |

**Returns:** *Promise*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

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

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L61)

___

### openmrsObservableFetch

▸ **openmrsObservableFetch**<T\>(`url`: *string*, `fetchInit?`: FetchConfig): *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

The openmrsObservableFetch function is a wrapper around openmrsFetch
that returns an [Observable](https://rxjs-dev.firebaseapp.com/guide/observable)
instead of a promise. It exists in case using an Observable is
preferred or more convenient than a promise.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `url` | *string* | - | See [openmrsFetch](API.md#openmrsfetch) |
| `fetchInit` | FetchConfig | {} | See [openmrsFetch](API.md#openmrsfetch) |

**Returns:** *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

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

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:232](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L232)

___

## API Object Functions

### fetchCurrentPatient

▸ **fetchCurrentPatient**(`patientUuid`: [*PatientUuid*](API.md#patientuuid)): *Promise*<{ `data`: Patient  }\> \| *Promise*<``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | [*PatientUuid*](API.md#patientuuid) |

**Returns:** *Promise*<{ `data`: Patient  }\> \| *Promise*<``null``\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/current-patient.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-patient.ts#L23)

___

### getCurrentUser

▸ **getCurrentUser**(): *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

The getCurrentUser function returns an observable that produces
**zero or more values, over time**. It will produce zero values
by default if the user is not logged in. And it will provide a
first value when the logged in user is fetched from the server.
Subsequent values will be produced whenever the user object is
updated.

**Returns:** *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

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

Defined in: [packages/framework/esm-api/src/shared-api-objects/current-user.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L56)

▸ **getCurrentUser**(`opts`: [*CurrentUserWithResponseOption*](interfaces/currentuserwithresponseoption.md)): *Observable*<[*UnauthenticatedUser*](interfaces/unauthenticateduser.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [*CurrentUserWithResponseOption*](interfaces/currentuserwithresponseoption.md) |

**Returns:** *Observable*<[*UnauthenticatedUser*](interfaces/unauthenticateduser.md)\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/current-user.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L57)

▸ **getCurrentUser**(`opts`: [*CurrentUserWithoutResponseOption*](interfaces/currentuserwithoutresponseoption.md)): *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [*CurrentUserWithoutResponseOption*](interfaces/currentuserwithoutresponseoption.md) |

**Returns:** *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/current-user.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L60)

___

### refetchCurrentUser

▸ **refetchCurrentUser**(): *void*

The `refetchCurrentUser` function causes a network request to redownload
the user. All subscribers to the current user will be notified of the
new users once the new version of the user object is downloaded.

**Returns:** *void*

The same observable as returned by [getCurrentUser](API.md#getcurrentuser).

#### Example
```js
import { refetchCurrentUser } from '@openmrs/esm-api'
refetchCurrentUser()
```

Defined in: [packages/framework/esm-api/src/shared-api-objects/current-user.ts:116](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L116)

___

## Breadcrumb Functions

### filterBreadcrumbs

▸ **filterBreadcrumbs**(`list`: [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[], `path`: *string*): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `list` | [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[] |
| `path` | *string* |

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [packages/framework/esm-breadcrumbs/src/filter.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/filter.ts#L49)

___

### getBreadcrumbs

▸ **getBreadcrumbs**(): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [packages/framework/esm-breadcrumbs/src/db.ts:50](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L50)

___

### getBreadcrumbsFor

▸ **getBreadcrumbsFor**(`path`: *string*): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | *string* |

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [packages/framework/esm-breadcrumbs/src/filter.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/filter.ts#L78)

___

### registerBreadcrumb

▸ **registerBreadcrumb**(`breadcrumb`: [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `breadcrumb` | [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-breadcrumbs/src/db.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L26)

___

### registerBreadcrumbs

▸ **registerBreadcrumbs**(`breadcrumbs`: [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)[]): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `breadcrumbs` | [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)[] |

**Returns:** *void*

Defined in: [packages/framework/esm-breadcrumbs/src/db.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L35)

___

## Navigation Functions

### interpolateString

▸ **interpolateString**(`template`: *string*, `params`: *object*): *string*

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
| `template` | *string* | With optional params wrapped in `${ }` |
| `params` | *object* | Values to interpolate into the string template |

**Returns:** *string*

Defined in: [packages/framework/esm-config/src/navigation/interpolate-string.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/interpolate-string.ts#L38)

___

### isUrl

▸ `Const` **isUrl**(`value`: *any*): *string* \| *void*

Verifies that a string contains only the default URL template parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *any* |

**Returns:** *string* \| *void*

Defined in: [packages/framework/esm-config/src/validators/validators.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L55)

___

### isUrlWithTemplateParameters

▸ `Const` **isUrlWithTemplateParameters**(`allowedTemplateParameters`: *string*[]): [*Validator*](API.md#validator)

Verifies that a string contains only the default URL template
parameters, plus any specified in `allowedTemplateParameters`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowedTemplateParameters` | *string*[] | To be added to `openmrsBase` and `openmrsSpaBase` |

**Returns:** [*Validator*](API.md#validator)

Defined in: [packages/framework/esm-config/src/validators/validators.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L23)

___

### navigate

▸ **navigate**(`__namedParameters`: [*NavigateOptions*](interfaces/navigateoptions.md)): *void*

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
| `__namedParameters` | [*NavigateOptions*](interfaces/navigateoptions.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-config/src/navigation/navigate.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/navigate.ts#L29)

___

## Other Functions

### age

▸ **age**(`dateString`: *string*): *string*

Gets a human readable age represention of the provided date string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dateString` | *string* | The stringified date. |

**Returns:** *string*

A human-readable string version of the age.

Defined in: [packages/framework/esm-utils/src/age-helpers.tsx:37](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L37)

___

### attach

▸ **attach**(`extensionSlotName`: *string*, `extensionId`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |
| `extensionId` | *string* |

**Returns:** *void*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L70)

___

### checkStatus

▸ **checkStatus**(`online?`: *boolean* \| *object*, `offline?`: *boolean* \| *object*): *boolean*

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `online` | *boolean* \| *object* | true |
| `offline` | *boolean* \| *object* | false |

**Returns:** *boolean*

Defined in: [packages/framework/esm-extensions/src/helpers.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L1)

___

### checkStatusFor

▸ **checkStatusFor**(`status`: *boolean*, `online?`: *boolean* \| *object*, `offline?`: *boolean* \| *object*): *boolean*

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | *boolean* | - |
| `online` | *boolean* \| *object* | true |
| `offline` | *boolean* \| *object* | false |

**Returns:** *boolean*

Defined in: [packages/framework/esm-extensions/src/helpers.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L9)

___

### createAppState

▸ **createAppState**(`initialState`: [*AppState*](interfaces/appstate.md)): *Store*<[*AppState*](interfaces/appstate.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialState` | [*AppState*](interfaces/appstate.md) |

**Returns:** *Store*<[*AppState*](interfaces/appstate.md)\>

Defined in: [packages/framework/esm-state/src/state.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L59)

___

### createErrorHandler

▸ **createErrorHandler**(): *function*

**Returns:** (`incomingErr`: *any*) => *void*

Defined in: [packages/framework/esm-error-handling/src/index.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-error-handling/src/index.ts#L33)

___

### createGlobalStore

▸ **createGlobalStore**<TState\>(`name`: *string*, `initialState`: TState): *Store*<TState\>

#### Type parameters

| Name |
| :------ |
| `TState` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | *string* |
| `initialState` | TState |

**Returns:** *Store*<TState\>

Defined in: [packages/framework/esm-state/src/state.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L10)

___

### createUseStore

▸ **createUseStore**<T\>(`store`: *Store*<T\>): *function*

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | *Store*<T\> |

**Returns:** () => T(`actions`: [*Actions*](API.md#actions)) => T & [*BoundActions*](API.md#boundactions)(`actions?`: [*Actions*](API.md#actions)) => T & [*BoundActions*](API.md#boundactions)

Defined in: [packages/framework/esm-react-utils/src/createUseStore.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/createUseStore.ts#L21)

___

### daysIntoYear

▸ **daysIntoYear**(`date`: Date): *number*

Gets the number of days in the year of the given date.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | Date | The date to compute the days within the year. |

**Returns:** *number*

The number of days.

Defined in: [packages/framework/esm-utils/src/age-helpers.tsx:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L6)

___

### defineConfigSchema

▸ **defineConfigSchema**(`moduleName`: *string*, `schema`: [*ConfigSchema*](interfaces/configschema.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |
| `schema` | [*ConfigSchema*](interfaces/configschema.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-config/src/module-config/module-config.ts:203](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L203)

___

### detach

▸ **detach**(`extensionSlotName`: *string*, `extensionId`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |
| `extensionId` | *string* |

**Returns:** *void*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:100](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L100)

___

### detachAll

▸ **detachAll**(`extensionSlotName`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |

**Returns:** *void*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:123](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L123)

___

### dispatchConnectivityChanged

▸ **dispatchConnectivityChanged**(`online`: *boolean*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `online` | *boolean* |

**Returns:** *void*

Defined in: [packages/framework/esm-globals/src/events.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L7)

___

### dispatchNetworkRequestFailed

▸ **dispatchNetworkRequestFailed**(`data`: [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-offline/src/events.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L5)

___

### dispatchNotificationShown

▸ **dispatchNotificationShown**(`data`: [*ShowNotificationEvent*](interfaces/shownotificationevent.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [*ShowNotificationEvent*](interfaces/shownotificationevent.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-globals/src/events.ts:46](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L46)

___

### getAppState

▸ **getAppState**(): *Store*<[*AppState*](interfaces/appstate.md)\>

**Returns:** *Store*<[*AppState*](interfaces/appstate.md)\>

Defined in: [packages/framework/esm-state/src/state.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L63)

___

### getAssignedIds

▸ **getAssignedIds**(`instance`: [*ExtensionSlotInstance*](interfaces/extensionslotinstance.md), `attachedIds`: *string*[]): *string*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | [*ExtensionSlotInstance*](interfaces/extensionslotinstance.md) |
| `attachedIds` | *string*[] |

**Returns:** *string*[]

Defined in: [packages/framework/esm-extensions/src/extensions.ts:144](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L144)

___

### getAsyncExtensionLifecycle

▸ `Const` **getAsyncExtensionLifecycle**<T\>(`lazy`: () => *Promise*<{ `default`: *React.ComponentType*<T\>  }\>, `options`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): *function*

**`deprecated`** Use getAsyncLifecycle instead.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `lazy` | () => *Promise*<{ `default`: *React.ComponentType*<T\>  }\> |
| `options` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** () => *Promise*<ReactAppOrParcel<any\>\>

Defined in: [packages/framework/esm-react-utils/src/getLifecycle.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L38)

___

### getAsyncLifecycle

▸ **getAsyncLifecycle**<T\>(`lazy`: () => *Promise*<{ `default`: *React.ComponentType*<T\>  }\>, `options`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): *function*

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `lazy` | () => *Promise*<{ `default`: *React.ComponentType*<T\>  }\> |
| `options` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** () => *Promise*<ReactAppOrParcel<any\>\>

Defined in: [packages/framework/esm-react-utils/src/getLifecycle.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L20)

___

### getConfig

▸ **getConfig**(`moduleName`: *string*): *Promise*<[*Config*](interfaces/config.md)\>

A promise-based way to access the config as soon as it is fully loaded
from the import-map. If it is already loaded, resolves the config in its
present state.

In general you should use the Unistore-based API provided by
`getConfigStore`, which allows creating a subscription so that you always
have the latest config. If using React, just use `useConfig`.

This is a useful function if you need to get the config in the course
of the execution of a function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | *string* | The name of the module for which to look up the config |

**Returns:** *Promise*<[*Config*](interfaces/config.md)\>

Defined in: [packages/framework/esm-config/src/module-config/module-config.ts:232](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L232)

___

### getConfigStore

▸ **getConfigStore**(`moduleName`: *string*): *Store*<[*ConfigStore*](interfaces/configstore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |

**Returns:** *Store*<[*ConfigStore*](interfaces/configstore.md)\>

Defined in: [packages/framework/esm-config/src/module-config/state.ts:142](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L142)

___

### getCustomProps

▸ **getCustomProps**(`online`: *boolean* \| *object* \| *undefined*, `offline`: *boolean* \| *object* \| *undefined*): *object*

#### Parameters

| Name | Type |
| :------ | :------ |
| `online` | *boolean* \| *object* \| *undefined* |
| `offline` | *boolean* \| *object* \| *undefined* |

**Returns:** *object*

Defined in: [packages/framework/esm-extensions/src/helpers.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L17)

___

### getExtensionConfigStore

▸ **getExtensionConfigStore**(`extensionSlotModuleName`: *string*, `attachedExtensionSlotName`: *string*, `extensionId`: *string*): *Store*<[*ConfigStore*](interfaces/configstore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotModuleName` | *string* |
| `attachedExtensionSlotName` | *string* |
| `extensionId` | *string* |

**Returns:** *Store*<[*ConfigStore*](interfaces/configstore.md)\>

Defined in: [packages/framework/esm-config/src/module-config/state.ts:172](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L172)

___

### getExtensionNameFromId

▸ **getExtensionNameFromId**(`extensionId`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionId` | *string* |

**Returns:** *string*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L29)

___

### getExtensionRegistration

▸ **getExtensionRegistration**(`extensionId`: *string*): [*ExtensionRegistration*](interfaces/extensionregistration.md) \| *undefined*

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionId` | *string* |

**Returns:** [*ExtensionRegistration*](interfaces/extensionregistration.md) \| *undefined*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L42)

___

### getExtensionRegistrationFrom

▸ **getExtensionRegistrationFrom**(`state`: [*ExtensionStore*](interfaces/extensionstore.md), `extensionId`: *string*): [*ExtensionRegistration*](interfaces/extensionregistration.md) \| *undefined*

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [*ExtensionStore*](interfaces/extensionstore.md) |
| `extensionId` | *string* |

**Returns:** [*ExtensionRegistration*](interfaces/extensionregistration.md) \| *undefined*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L34)

___

### getExtensionSlotsConfigStore

▸ **getExtensionSlotsConfigStore**(`moduleName`: *string*): *Store*<[*ExtensionSlotConfigsStore*](interfaces/extensionslotconfigsstore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |

**Returns:** *Store*<[*ExtensionSlotConfigsStore*](interfaces/extensionslotconfigsstore.md)\>

Defined in: [packages/framework/esm-config/src/module-config/state.ts:163](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L163)

___

### getExtensionSlotsForModule

▸ **getExtensionSlotsForModule**(`moduleName`: *string*): *string*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |

**Returns:** *string*[]

Defined in: [packages/framework/esm-extensions/src/extensions.ts:255](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L255)

___

### getGlobalStore

▸ **getGlobalStore**<TState\>(`name`: *string*, `fallbackState?`: TState): *Store*<TState\>

#### Type parameters

| Name | Default |
| :------ | :------ |
| `TState` | *any* |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | *string* |
| `fallbackState?` | TState |

**Returns:** *Store*<TState\>

Defined in: [packages/framework/esm-state/src/state.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L39)

___

### getLifecycle

▸ **getLifecycle**<T\>(`Component`: *React.ComponentType*<T\>, `options`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): *ReactAppOrParcel*<any\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `Component` | *React.ComponentType*<T\> |
| `options` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** *ReactAppOrParcel*<any\>

Defined in: [packages/framework/esm-react-utils/src/getLifecycle.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L9)

___

### getLocations

▸ **getLocations**(): *Observable*<[*Location*](interfaces/location.md)[]\>

**Returns:** *Observable*<[*Location*](interfaces/location.md)[]\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/location.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/location.ts#L13)

___

### getOmrsServiceWorker

▸ **getOmrsServiceWorker**(): *Promise*<Workbox\>

Returns a `Workbox` instance which allows interacting with the application's global Service Worker.

**Warning:** The promise may never resolve if the Service Worker is never registered (which
can, for example, happen when the browser is missing the required capabilities).

**Returns:** *Promise*<Workbox\>

A promise which will resolve once the application's Service Worker has been initialized.

Defined in: [packages/framework/esm-offline/src/service-worker.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L49)

___

### getSyncLifecycle

▸ **getSyncLifecycle**<T\>(`Component`: *React.ComponentType*<T\>, `options`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): *function*

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `Component` | *React.ComponentType*<T\> |
| `options` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** () => *Promise*<ReactAppOrParcel<any\>\>

Defined in: [packages/framework/esm-react-utils/src/getLifecycle.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/getLifecycle.ts#L28)

___

### getSynchronizationCallbacks

▸ **getSynchronizationCallbacks**(): [*SynchronizeCallback*](API.md#synchronizecallback)[]

**Returns:** [*SynchronizeCallback*](API.md#synchronizecallback)[]

Defined in: [packages/framework/esm-offline/src/store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/store.ts#L13)

___

### getUpdatedExtensionSlotInfo

▸ **getUpdatedExtensionSlotInfo**(`slotName`: *string*, `moduleName`: *string*, `extensionSlot`: [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)): [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)

Returns information describing all extensions which can be rendered into an extension slot with
the specified name.
The returned information describe the extension itself, as well as the extension slot name(s)
with which it has been attached.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | *string* | The extension slot name for which matching extension info should be returned. |
| `moduleName` | *string* | The module name. Used for applying extension-specific config values to the result. |
| `extensionSlot` | [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md) | The extension slot information object. |

**Returns:** [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)

Defined in: [packages/framework/esm-extensions/src/extensions.ts:282](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L282)

___

### getVisitTypes

▸ **getVisitTypes**(): *Observable*<[*VisitType*](interfaces/visittype.md)[]\>

**Returns:** *Observable*<[*VisitType*](interfaces/visittype.md)[]\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/visit-type.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-type.ts#L14)

___

### getVisitsForPatient

▸ **getVisitsForPatient**(`patientUuid`: *string*, `abortController`: AbortController, `v?`: *string*): *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<{ `results`: [*Visit*](interfaces/visit.md)[]  }\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | *string* |
| `abortController` | AbortController |
| `v?` | *string* |

**Returns:** *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<{ `results`: [*Visit*](interfaces/visit.md)[]  }\>\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L23)

___

### handleApiError

▸ **handleApiError**(): *function*

**Returns:** (`incomingResponseErr`: *any*) => *void*

Defined in: [packages/framework/esm-error-handling/src/index.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-error-handling/src/index.ts#L3)

___

### inRange

▸ `Const` **inRange**(`min`: *number*, `max`: *number*): [*Validator*](API.md#validator)

Verifies that the value is between the provided minimum and maximum

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | *number* | Minimum acceptable value |
| `max` | *number* | Maximum acceptable value |

**Returns:** [*Validator*](API.md#validator)

Defined in: [packages/framework/esm-config/src/validators/validators.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L9)

___

### integrateBreakpoints

▸ **integrateBreakpoints**(): *void*

**Returns:** *void*

Defined in: [packages/framework/esm-styleguide/src/breakpoints/index.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/breakpoints/index.ts#L20)

___

### isOmrsDateStrict

▸ **isOmrsDateStrict**(`omrsPayloadString`: *string*): *boolean*

This function is STRICT on checking whether a date string is the openmrs format.
The format should be YYYY-MM-DDTHH:mm:ss.SSSZZ

#### Parameters

| Name | Type |
| :------ | :------ |
| `omrsPayloadString` | *string* |

**Returns:** *boolean*

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L16)

___

### isOmrsDateToday

▸ **isOmrsDateToday**(`date`: [*DateInput*](API.md#dateinput)): *boolean*

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) | Checks if the provided date is today. |

**Returns:** *boolean*

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L53)

___

### isSameDay

▸ **isSameDay**(`firstDate`: Date, `secondDate`: Date): *boolean*

Checks if two dates are representing the same day.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `firstDate` | Date | The first date. |
| `secondDate` | Date | The second date. |

**Returns:** *boolean*

True if both are located on the same day.

Defined in: [packages/framework/esm-utils/src/age-helpers.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L23)

___

### makeUrl

▸ **makeUrl**(`path`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | *string* |

**Returns:** *string*

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/openmrs-fetch.ts#L8)

___

### messageOmrsServiceWorker

▸ **messageOmrsServiceWorker**(`message`: [*KnownOmrsServiceWorkerMessages*](API.md#knownomrsserviceworkermessages)): *Promise*<[*MessageServiceWorkerResult*](interfaces/messageserviceworkerresult.md)<any\>\>

Sends the specified message to the application's service worker.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [*KnownOmrsServiceWorkerMessages*](API.md#knownomrsserviceworkermessages) | The message to be sent. |

**Returns:** *Promise*<[*MessageServiceWorkerResult*](interfaces/messageserviceworkerresult.md)<any\>\>

A promise which completes when the message has been successfully processed by the Service Worker.

Defined in: [packages/framework/esm-offline/src/service-worker-messaging.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L9)

___

### openVisitsNoteWorkspace

▸ **openVisitsNoteWorkspace**(`componentName`: *string*, `title`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | *string* |
| `title` | *string* |

**Returns:** *void*

Defined in: [packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L12)

___

### openmrsComponentDecorator

▸ **openmrsComponentDecorator**(`userOpts`: [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md)): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `userOpts` | [*ComponentDecoratorOptions*](interfaces/componentdecoratoroptions.md) |

**Returns:** (`Comp`: *ComponentType*<{}\>) => *ComponentType*<any\>

Defined in: [packages/framework/esm-react-utils/src/openmrsComponentDecorator.tsx:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/openmrsComponentDecorator.tsx#L71)

___

### processConfig

▸ **processConfig**(`schema`: [*ConfigSchema*](interfaces/configschema.md), `providedConfig`: [*ConfigObject*](interfaces/configobject.md), `keyPathContext`: *string*): [*Config*](interfaces/config.md)

Validate and interpolate defaults for `providedConfig` according to `schema`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [*ConfigSchema*](interfaces/configschema.md) | a configuration schema |
| `providedConfig` | [*ConfigObject*](interfaces/configobject.md) | an object of config values (without the top-level module name) |
| `keyPathContext` | *string* | a dot-deparated string which helps the user figure out where     the provided config came from |

**Returns:** [*Config*](interfaces/config.md)

Defined in: [packages/framework/esm-config/src/module-config/module-config.ts:254](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L254)

___

### provide

▸ **provide**(`config`: [*Config*](interfaces/config.md), `sourceName?`: *string*): *void*

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `config` | [*Config*](interfaces/config.md) | - |
| `sourceName` | *string* | "provided" |

**Returns:** *void*

Defined in: [packages/framework/esm-config/src/module-config/module-config.ts:211](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L211)

___

### pushNavigationContext

▸ **pushNavigationContext**(`_context`: [*NavigationContext*](interfaces/navigationcontext.md)): *function*

**`deprecated`** don't use

#### Parameters

| Name | Type |
| :------ | :------ |
| `_context` | [*NavigationContext*](interfaces/navigationcontext.md) |

**Returns:** () => *void*

Defined in: [packages/framework/esm-extensions/src/contexts.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L24)

___

### registerExtension

▸ `Const` **registerExtension**(`name`: *string*, `details`: [*ExtensionDetails*](interfaces/extensiondetails.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | *string* |
| `details` | [*ExtensionDetails*](interfaces/extensiondetails.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L57)

___

### registerExtensionSlot

▸ **registerExtensionSlot**(`moduleName`: *string*, `slotName`: *string*): *void*

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | *string* | The name of the module that contains the extension slot |
| `slotName` | *string* | The extension slot name that is actually used |

**Returns:** *void*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:208](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L208)

___

### registerOmrsServiceWorker

▸ **registerOmrsServiceWorker**(`scriptUrl`: *string*, `registerOptions?`: *object*): *Workbox*

If not yet registered, registers the application's global Service Worker.
Throws if registration is not possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptUrl` | *string* |
| `registerOptions?` | *object* |

**Returns:** *Workbox*

The registered Service Worker.

Defined in: [packages/framework/esm-offline/src/service-worker.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L18)

___

### registerSynchronizationCallback

▸ **registerSynchronizationCallback**(`cb`: [*SynchronizeCallback*](API.md#synchronizecallback)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [*SynchronizeCallback*](API.md#synchronizecallback) |

**Returns:** *void*

Defined in: [packages/framework/esm-offline/src/store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/store.ts#L17)

___

### renderExtension

▸ **renderExtension**(`domElement`: HTMLElement, `extensionSlotName`: *string*, `extensionSlotModuleName`: *string*, `extensionId`: *string*, `renderFunction?`: (`lifecycle`: [*Lifecycle*](interfaces/lifecycle.md)) => [*Lifecycle*](interfaces/lifecycle.md), `additionalProps?`: *Record*<string, any\>): [*CancelLoading*](interfaces/cancelloading.md)

Mounts into a DOM node (representing an extension slot)
a lazy-loaded component from *any* microfrontend
that registered an extension component for this slot.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `domElement` | HTMLElement | - |
| `extensionSlotName` | *string* | - |
| `extensionSlotModuleName` | *string* | - |
| `extensionId` | *string* | - |
| `renderFunction` | (`lifecycle`: [*Lifecycle*](interfaces/lifecycle.md)) => [*Lifecycle*](interfaces/lifecycle.md) | - |
| `additionalProps` | *Record*<string, any\> | {} |

**Returns:** [*CancelLoading*](interfaces/cancelloading.md)

Defined in: [packages/framework/esm-extensions/src/render.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/render.ts#L23)

___

### renderLoadingSpinner

▸ **renderLoadingSpinner**(`target`: HTMLElement): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | HTMLElement |

**Returns:** () => *any*

Defined in: [packages/framework/esm-styleguide/src/spinner/index.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/spinner/index.ts#L1)

___

### renderNotifications

▸ **renderNotifications**(`target`: HTMLElement \| ``null``): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | HTMLElement \| ``null`` |

**Returns:** *void*

Defined in: [packages/framework/esm-styleguide/src/notifications/index.tsx:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L14)

___

### reportError

▸ **reportError**(`err`: *any*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | *any* |

**Returns:** *void*

Defined in: [packages/framework/esm-error-handling/src/index.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-error-handling/src/index.ts#L26)

___

### saveVisit

▸ **saveVisit**(`payload`: [*NewVisitPayload*](interfaces/newvisitpayload.md), `abortController`: AbortController): *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<any\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [*NewVisitPayload*](interfaces/newvisitpayload.md) |
| `abortController` | AbortController |

**Returns:** *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<any\>\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L55)

___

### setupPaths

▸ **setupPaths**(`config`: [*SpaConfig*](interfaces/spaconfig.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [*SpaConfig*](interfaces/spaconfig.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-globals/src/globals.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/globals.ts#L3)

___

### setupUtils

▸ **setupUtils**(): *void*

**Returns:** *void*

Defined in: [packages/framework/esm-globals/src/globals.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/globals.ts#L11)

___

### showNotification

▸ **showNotification**(`notification`: NotificationDescriptor): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `notification` | NotificationDescriptor |

**Returns:** *void*

Defined in: [packages/framework/esm-styleguide/src/notifications/index.tsx:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-styleguide/src/notifications/index.tsx#L28)

___

### subscribeConnectivity

▸ **subscribeConnectivity**(`cb`: (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [packages/framework/esm-globals/src/events.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L22)

___

### subscribeConnectivityChanged

▸ **subscribeConnectivityChanged**(`cb`: (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [packages/framework/esm-globals/src/events.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L13)

___

### subscribeNetworkRequestFailed

▸ **subscribeNetworkRequestFailed**(`cb`: (`data`: [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md)) => *void*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [packages/framework/esm-offline/src/events.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L11)

___

### subscribeNotificationShown

▸ **subscribeNotificationShown**(`cb`: (`data`: [*ShowNotificationEvent*](interfaces/shownotificationevent.md)) => *void*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [*ShowNotificationEvent*](interfaces/shownotificationevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [packages/framework/esm-globals/src/events.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L52)

___

### subscribeTo

▸ **subscribeTo**<T, U\>(`store`: *Store*<T\>, `select`: (`state`: T) => U, `handle`: (`subState`: U) => *void*): Unsubscribe

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | *Store*<T\> |
| `select` | (`state`: T) => U |
| `handle` | (`subState`: U) => *void* |

**Returns:** Unsubscribe

Defined in: [packages/framework/esm-state/src/state.ts:67](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L67)

___

### switchTo

▸ **switchTo**<T\>(`_type`: [*NavigationContextType*](API.md#navigationcontexttype), `link`: *string*, `_state?`: T): *void*

**`deprecated`** use `navigate` directly

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_type` | [*NavigationContextType*](API.md#navigationcontexttype) |
| `link` | *string* |
| `_state?` | T |

**Returns:** *void*

Defined in: [packages/framework/esm-extensions/src/contexts.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L13)

___

### toDateObjectStrict

▸ **toDateObjectStrict**(`omrsDateString`: *string*): Date \| ``null``

Converts the object to a date object if it is a valid ISO date time string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `omrsDateString` | *string* |

**Returns:** Date \| ``null``

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L60)

___

### toLocationObject

▸ **toLocationObject**(`openmrsRestForm`: *any*): [*Location*](interfaces/location.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `openmrsRestForm` | *any* |

**Returns:** [*Location*](interfaces/location.md)

Defined in: [packages/framework/esm-api/src/shared-api-objects/location.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/location.ts#L6)

___

### toOmrsDateFormat

▸ **toOmrsDateFormat**(`date`: [*DateInput*](API.md#dateinput), `format?`: *string*): *string*

Formats the input as a date string. By default the format "YYYY-MMM-DD" is used.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) | - |
| `format` | *string* | "YYYY-MMM-DD" |

**Returns:** *string*

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L112)

___

### toOmrsDayDateFormat

▸ **toOmrsDayDateFormat**(`date`: [*DateInput*](API.md#dateinput)): *string*

Formats the input as a date string using the format "DD - MMM - YYYY".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) |

**Returns:** *string*

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:98](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L98)

___

### toOmrsIsoString

▸ **toOmrsIsoString**(`date`: [*DateInput*](API.md#dateinput), `toUTC?`: *boolean*): *string*

Formats the input as a date time string using the format "YYYY-MM-DDTHH:mm:ss.SSSZZ".

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) | - |
| `toUTC` | *boolean* | false |

**Returns:** *string*

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L71)

___

### toOmrsTimeString

▸ **toOmrsTimeString**(`date`: [*DateInput*](API.md#dateinput)): *string*

Formats the input as a time string using the format "HH:mm A".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) |

**Returns:** *string*

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:91](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L91)

___

### toOmrsTimeString24

▸ **toOmrsTimeString24**(`date`: [*DateInput*](API.md#dateinput)): *string*

Formats the input as a time string using the format "HH:mm".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) |

**Returns:** *string*

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L84)

___

### toOmrsYearlessDateFormat

▸ **toOmrsYearlessDateFormat**(`date`: [*DateInput*](API.md#dateinput)): *string*

Formats the input as a date string using the format "DD-MMM".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) |

**Returns:** *string*

Defined in: [packages/framework/esm-utils/src/omrs-dates.ts:105](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L105)

___

### toVisitTypeObject

▸ **toVisitTypeObject**(`openmrsRestForm`: *any*): [*VisitType*](interfaces/visittype.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `openmrsRestForm` | *any* |

**Returns:** [*VisitType*](interfaces/visittype.md)

Defined in: [packages/framework/esm-api/src/shared-api-objects/visit-type.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-type.ts#L6)

___

### translateFrom

▸ **translateFrom**(`moduleName`: *string*, `key`: *string*, `fallback?`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |
| `key` | *string* |
| `fallback?` | *string* |

**Returns:** *string*

Defined in: [packages/framework/esm-utils/src/translate.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/translate.ts#L3)

___

### unregisterExtensionSlot

▸ **unregisterExtensionSlot**(`moduleName`: *string*, `slotName`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |
| `slotName` | *string* |

**Returns:** *void*

Defined in: [packages/framework/esm-extensions/src/extensions.ts:231](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L231)

___

### update

▸ **update**<T\>(`obj`: T, `__namedParameters`: *string*[], `value`: *any*): T

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | *Record*<string, any\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | T |
| `__namedParameters` | *string*[] |
| `value` | *any* |

**Returns:** T

Defined in: [packages/framework/esm-state/src/update.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/update.ts#L1)

___

### updateExtensionStore

▸ **updateExtensionStore**<U\>(`updater`: (`state`: [*ExtensionStore*](interfaces/extensionstore.md)) => [*MaybeAsync*](API.md#maybeasync)<Pick<[*ExtensionStore*](interfaces/extensionstore.md), U\>\>): *void*

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | keyof [*ExtensionStore*](interfaces/extensionstore.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `updater` | (`state`: [*ExtensionStore*](interfaces/extensionstore.md)) => [*MaybeAsync*](API.md#maybeasync)<Pick<[*ExtensionStore*](interfaces/extensionstore.md), U\>\> |

**Returns:** *void*

Defined in: [packages/framework/esm-extensions/src/store.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L85)

___

### updateVisit

▸ **updateVisit**(`uuid`: *string*, `payload`: [*UpdateVisitPayload*](API.md#updatevisitpayload), `abortController`: AbortController): *Observable*<any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | *string* |
| `payload` | [*UpdateVisitPayload*](API.md#updatevisitpayload) |
| `abortController` | AbortController |

**Returns:** *Observable*<any\>

Defined in: [packages/framework/esm-api/src/shared-api-objects/visit-utils.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/visit-utils.ts#L69)

___

### useAssignedExtensionIds

▸ **useAssignedExtensionIds**(`extensionSlotName`: *string*): *string*[]

Gets the assigned extension ids for a given extension slot name.
Does not consider if offline or online.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionSlotName` | *string* | The name of the slot to get the assigned IDs for. |

**Returns:** *string*[]

Defined in: [packages/framework/esm-react-utils/src/useAssignedExtensionIds.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useAssignedExtensionIds.ts#L11)

___

### useAttachedExtensionIds

▸ **useAttachedExtensionIds**(`extensionSlotName`: *string*): *string*[]

Gets the assigned extension ids for the given slot.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |

**Returns:** *string*[]

Defined in: [packages/framework/esm-react-utils/src/useAttachedExtensionIds.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useAttachedExtensionIds.ts#L11)

___

### useConfig

▸ **useConfig**(): *object*

Use this React Hook to obtain your module's configuration.

**Returns:** *object*

| Name | Type | Description |
| :------ | :------ | :------ |
| `constructor` | Function | The initial value of Object.prototype.constructor is the standard built-in Object constructor. |
| `hasOwnProperty` | (`v`: PropertyKey) => *boolean* | - |
| `isPrototypeOf` | (`v`: Object) => *boolean* | - |
| `propertyIsEnumerable` | (`v`: PropertyKey) => *boolean* | - |
| `toLocaleString` | () => *string* | - |
| `toString` | () => *string* | - |
| `valueOf` | () => Object | - |

Defined in: [packages/framework/esm-react-utils/src/useConfig.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConfig.ts#L104)

___

### useConnectedExtensions

▸ **useConnectedExtensions**(`extensionSlotName`: *string*): [*ExtensionRegistration*](interfaces/extensionregistration.md)[]

Gets the assigned extension for a given extension slot name.
Considers if offline or online.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensionSlotName` | *string* | The name of the slot to get the assigned extensions for. |

**Returns:** [*ExtensionRegistration*](interfaces/extensionregistration.md)[]

Defined in: [packages/framework/esm-react-utils/src/useConnectedExtensions.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConnectedExtensions.ts#L31)

___

### useConnectivity

▸ **useConnectivity**(): *boolean*

**Returns:** *boolean*

Defined in: [packages/framework/esm-react-utils/src/useConnectivity.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConnectivity.ts#L4)

___

### useCurrentPatient

▸ **useCurrentPatient**(`patientUuid?`: [*PatientUuid*](API.md#patientuuid)): [*boolean*, NullablePatient, [*PatientUuid*](API.md#patientuuid), Error \| ``null``]

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | [*PatientUuid*](API.md#patientuuid) |

**Returns:** [*boolean*, NullablePatient, [*PatientUuid*](API.md#patientuuid), Error \| ``null``]

Defined in: [packages/framework/esm-react-utils/src/useCurrentPatient.ts:79](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useCurrentPatient.ts#L79)

___

### useExtension

▸ **useExtension**<TRef\>(`state?`: *Record*<string, any\>): [*RefObject*<TRef\>, [*ExtensionData*](interfaces/extensiondata.md) \| *undefined*]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRef` | HTMLElement |

#### Parameters

| Name | Type |
| :------ | :------ |
| `state?` | *Record*<string, any\> |

**Returns:** [*RefObject*<TRef\>, [*ExtensionData*](interfaces/extensiondata.md) \| *undefined*]

Defined in: [packages/framework/esm-react-utils/src/useExtension.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtension.ts#L5)

___

### useExtensionSlot

▸ **useExtensionSlot**(`extensionSlotName`: *string*): *object*

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `extensionSlotModuleName` | *string* |
| `extensionSlotName` | *string* |
| `extensions` | [*ExtensionRegistration*](interfaces/extensionregistration.md)[] |

Defined in: [packages/framework/esm-react-utils/src/useExtensionSlot.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionSlot.ts#L9)

___

### useExtensionSlotConfig

▸ **useExtensionSlotConfig**(`extensionSlotName`: *string*): [*ExtensionSlotConfigObject*](interfaces/extensionslotconfigobject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |

**Returns:** [*ExtensionSlotConfigObject*](interfaces/extensionslotconfigobject.md)

Defined in: [packages/framework/esm-react-utils/src/useExtensionSlotConfig.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionSlotConfig.ts#L16)

___

### useExtensionSlotMeta

▸ **useExtensionSlotMeta**(`extensionSlotName`: *string*): *object*

Extract meta data from all extension for a given extension slot.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |

**Returns:** *object*

Defined in: [packages/framework/esm-react-utils/src/useExtensionSlotMeta.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionSlotMeta.ts#L8)

___

### useExtensionStore

▸ `Const` **useExtensionStore**(): T

**Returns:** T

Defined in: [packages/framework/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionStore.ts#L4)

▸ `Const` **useExtensionStore**(`actions`: [*Actions*](API.md#actions)): T & [*BoundActions*](API.md#boundactions)

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | [*Actions*](API.md#actions) |

**Returns:** T & [*BoundActions*](API.md#boundactions)

Defined in: [packages/framework/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionStore.ts#L4)

▸ `Const` **useExtensionStore**(`actions?`: [*Actions*](API.md#actions)): T & [*BoundActions*](API.md#boundactions)

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions?` | [*Actions*](API.md#actions) |

**Returns:** T & [*BoundActions*](API.md#boundactions)

Defined in: [packages/framework/esm-react-utils/src/useExtensionStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useExtensionStore.ts#L4)

___

### useForceUpdate

▸ **useForceUpdate**(): *function*

**Returns:** () => *void*

Defined in: [packages/framework/esm-react-utils/src/useForceUpdate.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useForceUpdate.ts#L3)

___

### useLayoutType

▸ **useLayoutType**(): [*LayoutType*](API.md#layouttype)

**Returns:** [*LayoutType*](API.md#layouttype)

Defined in: [packages/framework/esm-react-utils/src/useLayoutType.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useLayoutType.ts#L22)

___

### useLocations

▸ **useLocations**(): [*Location*](interfaces/location.md)[]

**Returns:** [*Location*](interfaces/location.md)[]

Defined in: [packages/framework/esm-react-utils/src/useLocations.tsx:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useLocations.tsx#L4)

___

### useNavigationContext

▸ **useNavigationContext**(`context`: [*NavigationContext*](interfaces/navigationcontext.md)): *void*

**`deprecated`** Don't use this anymore.

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [*NavigationContext*](interfaces/navigationcontext.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-react-utils/src/useNavigationContext.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useNavigationContext.ts#L10)

___

### usePagination

▸ **usePagination**<T\>(`data?`: T[], `resultsPerPage?`: *number*): *object*

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | T[] | [] |
| `resultsPerPage` | *number* | - |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `currentPage` | *number* |
| `paginated` | *boolean* |
| `results` | T[] |
| `showNextButton` | *boolean* |
| `showPreviousButton` | *boolean* |
| `totalPages` | *number* |
| `goTo` | (`page`: *number*) => *void* |
| `goToNext` | () => *void* |
| `goToPrevious` | () => *void* |

Defined in: [packages/framework/esm-react-utils/src/usePagination.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/usePagination.ts#L5)

___

### useSessionUser

▸ **useSessionUser**(): ``null`` \| [*SessionUser*](interfaces/sessionuser.md)

**Returns:** ``null`` \| [*SessionUser*](interfaces/sessionuser.md)

Defined in: [packages/framework/esm-react-utils/src/useSessionUser.tsx:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useSessionUser.tsx#L4)

___

### useStore

▸ **useStore**<T\>(`store`: *Store*<T\>): T

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | *Store*<T\> |

**Returns:** T

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useStore.ts#L4)

▸ **useStore**<T\>(`store`: *Store*<T\>, `actions`: [*Actions*](API.md#actions)): T & [*BoundActions*](API.md#boundactions)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | *Store*<T\> |
| `actions` | [*Actions*](API.md#actions) |

**Returns:** T & [*BoundActions*](API.md#boundactions)

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useStore.ts#L5)

___

### useStoreState

▸ **useStoreState**<T, U\>(`store`: *Store*<T\>, `select`: (`state`: T) => U): U

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | *Store*<T\> |
| `select` | (`state`: T) => U |

**Returns:** U

Defined in: [packages/framework/esm-react-utils/src/useStoreState.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useStoreState.ts#L5)

___

### useVisit

▸ **useVisit**(`patientUuid`: *string*): *object*

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | *string* |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `currentVisit` | ``null`` \| [*Visit*](interfaces/visit.md) |
| `error` | ``null`` |

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useVisit.ts#L11)

___

### useVisitTypes

▸ **useVisitTypes**(): [*VisitType*](interfaces/visittype.md)[]

**Returns:** [*VisitType*](interfaces/visittype.md)[]

Defined in: [packages/framework/esm-react-utils/src/useVisitTypes.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useVisitTypes.ts#L4)

___

### userHasAccess

▸ **userHasAccess**(`requiredPrivilege`: *string*, `user`: [*LoggedInUser*](interfaces/loggedinuser.md)): *undefined* \| [*Privilege*](interfaces/privilege.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `requiredPrivilege` | *string* |
| `user` | [*LoggedInUser*](interfaces/loggedinuser.md) |

**Returns:** *undefined* \| [*Privilege*](interfaces/privilege.md)

Defined in: [packages/framework/esm-api/src/shared-api-objects/current-user.ts:121](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/shared-api-objects/current-user.ts#L121)

___

### validator

▸ **validator**(`validationFunction`: [*ValidatorFunction*](API.md#validatorfunction), `message`: *string*): [*Validator*](API.md#validator)

#### Parameters

| Name | Type |
| :------ | :------ |
| `validationFunction` | [*ValidatorFunction*](API.md#validatorfunction) |
| `message` | *string* |

**Returns:** [*Validator*](API.md#validator)

Defined in: [packages/framework/esm-config/src/validators/validator.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validator.ts#L3)

___

## Workspace Functions

### getNewWorkspaceItem

▸ **getNewWorkspaceItem**(): *Observable*<[*WorkspaceItem*](interfaces/workspaceitem.md)\>

**Returns:** *Observable*<[*WorkspaceItem*](interfaces/workspaceitem.md)\>

Defined in: [packages/framework/esm-api/src/workspace/workspace.resource.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/workspace/workspace.resource.tsx#L19)

___

### newWorkspaceItem

▸ **newWorkspaceItem**(`item`: [*WorkspaceItem*](interfaces/workspaceitem.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [*WorkspaceItem*](interfaces/workspaceitem.md) |

**Returns:** *void*

Defined in: [packages/framework/esm-api/src/workspace/workspace.resource.tsx:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/workspace/workspace.resource.tsx#L10)
