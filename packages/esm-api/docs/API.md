[Back to README.md](../README.md)

# @openmrs/esm-api

## Table of contents

### Classes

- [OpenmrsFetchError](classes/openmrsfetcherror.md)

### Interfaces

- [CurrentUserOptions](interfaces/currentuseroptions.md)
- [CurrentUserWithResponseOption](interfaces/currentuserwithresponseoption.md)
- [CurrentUserWithoutResponseOption](interfaces/currentuserwithoutresponseoption.md)
- [FHIRRequestObj](interfaces/fhirrequestobj.md)
- [FetchHeaders](interfaces/fetchheaders.md)
- [FetchResponse](interfaces/fetchresponse.md)
- [LoggedInUser](interfaces/loggedinuser.md)
- [LoggedInUserFetchResponse](interfaces/loggedinuserfetchresponse.md)
- [Person](interfaces/person.md)
- [Privilege](interfaces/privilege.md)
- [Role](interfaces/role.md)
- [UnauthenticatedUser](interfaces/unauthenticateduser.md)
- [WorkspaceItem](interfaces/workspaceitem.md)

### Type aliases

- [CurrentPatient](API.md#currentpatient)
- [PatientUuid](API.md#patientuuid)

### Variables

- [backendDependencies](API.md#backenddependencies)
- [fhir](API.md#fhir)
- [fhirBaseUrl](API.md#fhirbaseurl)
- [sessionEndpoint](API.md#sessionendpoint)

### Functions

- [getCurrentPatient](API.md#getcurrentpatient)
- [getCurrentPatientUuid](API.md#getcurrentpatientuuid)
- [getCurrentUser](API.md#getcurrentuser)
- [getNewWorkspaceItem](API.md#getnewworkspaceitem)
- [makeUrl](API.md#makeurl)
- [newWorkspaceItem](API.md#newworkspaceitem)
- [openmrsFetch](API.md#openmrsfetch)
- [openmrsObservableFetch](API.md#openmrsobservablefetch)
- [refetchCurrentPatient](API.md#refetchcurrentpatient)
- [refetchCurrentUser](API.md#refetchcurrentuser)
- [setupApiModule](API.md#setupapimodule)
- [userHasAccess](API.md#userhasaccess)

## Type aliases

### CurrentPatient

Ƭ **CurrentPatient**: fhir.Patient \| [*FetchResponse*](interfaces/fetchresponse.md)<fhir.Patient\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L63)

___

### PatientUuid

Ƭ **PatientUuid**: *string* \| *null*

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L75)

## Variables

### backendDependencies

• `Const` **backendDependencies**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`fhir2` | *string* |
`webservices.rest` | *string* |

Defined in: [packages/esm-api/src/openmrs-backend-dependencies.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-backend-dependencies.ts#L1)

___

### fhir

• `Const` **fhir**: FhirClient

Defined in: [packages/esm-api/src/fhir.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/fhir.ts#L33)

___

### fhirBaseUrl

• `Const` **fhirBaseUrl**: */ws/fhir2/R4*

Defined in: [packages/esm-api/src/fhir.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/fhir.ts#L4)

___

### sessionEndpoint

• `Const` **sessionEndpoint**: */ws/rest/v1/session*= "/ws/rest/v1/session"

Defined in: [packages/esm-api/src/openmrs-fetch.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L6)

## Functions

### getCurrentPatient

▸ **getCurrentPatient**(): *Observable*<fhir.Patient\>

**Returns:** *Observable*<fhir.Patient\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L35)

▸ **getCurrentPatient**(`opts`: PatientWithFullResponse): *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<fhir.Patient\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`opts` | PatientWithFullResponse |

**Returns:** *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<fhir.Patient\>\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L36)

▸ **getCurrentPatient**(`opts`: OnlyThePatient): *Observable*<fhir.Patient\>

#### Parameters:

Name | Type |
:------ | :------ |
`opts` | OnlyThePatient |

**Returns:** *Observable*<fhir.Patient\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L39)

___

### getCurrentPatientUuid

▸ **getCurrentPatientUuid**(): *Observable*<[*PatientUuid*](API.md#patientuuid)\>

**Returns:** *Observable*<[*PatientUuid*](API.md#patientuuid)\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L59)

___

### getCurrentUser

▸ **getCurrentUser**(): *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

**Returns:** *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L16)

▸ **getCurrentUser**(`opts`: [*CurrentUserWithResponseOption*](interfaces/currentuserwithresponseoption.md)): *Observable*<[*UnauthenticatedUser*](interfaces/unauthenticateduser.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`opts` | [*CurrentUserWithResponseOption*](interfaces/currentuserwithresponseoption.md) |

**Returns:** *Observable*<[*UnauthenticatedUser*](interfaces/unauthenticateduser.md)\>

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L17)

▸ **getCurrentUser**(`opts`: [*CurrentUserWithoutResponseOption*](interfaces/currentuserwithoutresponseoption.md)): *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`opts` | [*CurrentUserWithoutResponseOption*](interfaces/currentuserwithoutresponseoption.md) |

**Returns:** *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L20)

___

### getNewWorkspaceItem

▸ **getNewWorkspaceItem**(): *Observable*<[*WorkspaceItem*](interfaces/workspaceitem.md)\>

**Returns:** *Observable*<[*WorkspaceItem*](interfaces/workspaceitem.md)\>

Defined in: [packages/esm-api/src/workspace/workspace.resource.tsx:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/workspace/workspace.resource.tsx#L9)

___

### makeUrl

▸ **makeUrl**(`path`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`path` | *string* |

**Returns:** *string*

Defined in: [packages/esm-api/src/openmrs-fetch.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L8)

___

### newWorkspaceItem

▸ **newWorkspaceItem**(`item`: [*WorkspaceItem*](interfaces/workspaceitem.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | [*WorkspaceItem*](interfaces/workspaceitem.md) |

**Returns:** *void*

Defined in: [packages/esm-api/src/workspace/workspace.resource.tsx:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/workspace/workspace.resource.tsx#L5)

___

### openmrsFetch

▸ **openmrsFetch**<T\>(`path`: *string*, `fetchInit?`: FetchConfig): *Promise*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`path` | *string* |
`fetchInit` | FetchConfig |

**Returns:** *Promise*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

Defined in: [packages/esm-api/src/openmrs-fetch.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L12)

___

### openmrsObservableFetch

▸ **openmrsObservableFetch**<T\>(`url`: *string*, `fetchInit?`: FetchConfig): *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`url` | *string* |
`fetchInit` | FetchConfig |

**Returns:** *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

Defined in: [packages/esm-api/src/openmrs-fetch.ts:148](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L148)

___

### refetchCurrentPatient

▸ **refetchCurrentPatient**(): *void*

**Returns:** *void*

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L53)

___

### refetchCurrentUser

▸ **refetchCurrentUser**(): *void*

**Returns:** *void*

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L61)

___

### setupApiModule

▸ **setupApiModule**(): *void*

**Returns:** *void*

Defined in: [packages/esm-api/src/setup.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/setup.ts#L4)

___

### userHasAccess

▸ **userHasAccess**(`requiredPrivilege`: *string*, `user`: [*LoggedInUser*](interfaces/loggedinuser.md)): *undefined* \| [*Privilege*](interfaces/privilege.md)

#### Parameters:

Name | Type |
:------ | :------ |
`requiredPrivilege` | *string* |
`user` | [*LoggedInUser*](interfaces/loggedinuser.md) |

**Returns:** *undefined* \| [*Privilege*](interfaces/privilege.md)

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L66)
