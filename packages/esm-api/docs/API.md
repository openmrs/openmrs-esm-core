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

### API Variables

- [fhir](API.md#fhir)

### Other Variables

- [backendDependencies](API.md#backenddependencies)
- [fhirBaseUrl](API.md#fhirbaseurl)
- [sessionEndpoint](API.md#sessionendpoint)

### API Functions

- [openmrsFetch](API.md#openmrsfetch)
- [openmrsObservableFetch](API.md#openmrsobservablefetch)

### API Object Functions

- [getCurrentPatient](API.md#getcurrentpatient)
- [getCurrentPatientUuid](API.md#getcurrentpatientuuid)
- [getCurrentUser](API.md#getcurrentuser)
- [refetchCurrentPatient](API.md#refetchcurrentpatient)
- [refetchCurrentUser](API.md#refetchcurrentuser)

### Other Functions

- [makeUrl](API.md#makeurl)
- [userHasAccess](API.md#userhasaccess)

### Workspace Functions

- [getNewWorkspaceItem](API.md#getnewworkspaceitem)
- [newWorkspaceItem](API.md#newworkspaceitem)

## Type aliases

### CurrentPatient

Ƭ **CurrentPatient**: fhir.Patient \| [*FetchResponse*](interfaces/fetchresponse.md)<fhir.Patient\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L74)

___

### PatientUuid

Ƭ **PatientUuid**: *string* \| *null*

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L86)

## API Variables

### fhir

• `Const` **fhir**: FhirClient

The `fhir` object is [an instance of fhir.js](https://github.com/FHIR/fhir.js)
that can be used to call FHIR-compliant OpenMRS APIs. See
[the docs for fhir.js](https://github.com/FHIR/fhir.js) for more info
and example usage.

Defined in: [packages/esm-api/src/fhir.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/fhir.ts#L41)

___

## Other Variables

### backendDependencies

• `Const` **backendDependencies**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`fhir2` | *string* |
`webservices.rest` | *string* |

Defined in: [packages/esm-api/src/openmrs-backend-dependencies.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-backend-dependencies.ts#L1)

___

### fhirBaseUrl

• `Const` **fhirBaseUrl**: */ws/fhir2/R4*

Defined in: [packages/esm-api/src/fhir.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/fhir.ts#L4)

___

### sessionEndpoint

• `Const` **sessionEndpoint**: */ws/rest/v1/session*= "/ws/rest/v1/session"

Defined in: [packages/esm-api/src/openmrs-fetch.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L6)

## API Functions

### openmrsFetch

▸ **openmrsFetch**<T\>(`path`: *string*, `fetchInit?`: FetchConfig): *Promise*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

The openmrsFetch function is a wrapper around the
[browser's built-in fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch),
with extra handling for OpenMRS-specific API behaviors, such as
request headers, authentication, authorization, and the API urls.

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`path` | *string* | A string url to make the request to. Note that the   openmrs base url (by default `/openmrs`) will be automatically   prepended to the URL, so there is no need to include it.   |
`fetchInit` | FetchConfig | A [fetch init object](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax).   Note that the `body` property does not need to be `JSON.stringify()`ed   because openmrsFetch will do that for you.   |

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

Defined in: [packages/esm-api/src/openmrs-fetch.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L61)

___

### openmrsObservableFetch

▸ **openmrsObservableFetch**<T\>(`url`: *string*, `fetchInit?`: FetchConfig): *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<T\>\>

The openmrsObservableFetch function is a wrapper around openmrsFetch
that returns an [Observable](https://rxjs-dev.firebaseapp.com/guide/observable)
instead of a promise. It exists in case using an Observable is
preferred or more convenient than a promise.

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`url` | *string* | See [openmrsFetch](API.md#openmrsfetch)   |
`fetchInit` | FetchConfig | See [openmrsFetch](API.md#openmrsfetch)   |

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

Defined in: [packages/esm-api/src/openmrs-fetch.ts:226](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L226)

___

## API Object Functions

### getCurrentPatient

▸ **getCurrentPatient**(): *Observable*<fhir.Patient\>

**Returns:** *Observable*<fhir.Patient\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L38)

▸ **getCurrentPatient**(`opts`: PatientWithFullResponse): *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<fhir.Patient\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`opts` | PatientWithFullResponse |

**Returns:** *Observable*<[*FetchResponse*](interfaces/fetchresponse.md)<fhir.Patient\>\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L39)

▸ **getCurrentPatient**(`opts`: OnlyThePatient): *Observable*<fhir.Patient\>

#### Parameters:

Name | Type |
:------ | :------ |
`opts` | OnlyThePatient |

**Returns:** *Observable*<fhir.Patient\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L42)

___

### getCurrentPatientUuid

▸ **getCurrentPatientUuid**(): *Observable*<[*PatientUuid*](API.md#patientuuid)\>

**Returns:** *Observable*<[*PatientUuid*](API.md#patientuuid)\>

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L70)

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

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L56)

▸ **getCurrentUser**(`opts`: [*CurrentUserWithResponseOption*](interfaces/currentuserwithresponseoption.md)): *Observable*<[*UnauthenticatedUser*](interfaces/unauthenticateduser.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`opts` | [*CurrentUserWithResponseOption*](interfaces/currentuserwithresponseoption.md) |

**Returns:** *Observable*<[*UnauthenticatedUser*](interfaces/unauthenticateduser.md)\>

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L57)

▸ **getCurrentUser**(`opts`: [*CurrentUserWithoutResponseOption*](interfaces/currentuserwithoutresponseoption.md)): *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`opts` | [*CurrentUserWithoutResponseOption*](interfaces/currentuserwithoutresponseoption.md) |

**Returns:** *Observable*<[*LoggedInUser*](interfaces/loggedinuser.md)\>

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L60)

___

### refetchCurrentPatient

▸ **refetchCurrentPatient**(): *void*

**Returns:** *void*

Defined in: [packages/esm-api/src/shared-api-objects/current-patient.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-patient.ts#L59)

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

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:116](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L116)

___

## Other Functions

### makeUrl

▸ **makeUrl**(`path`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`path` | *string* |

**Returns:** *string*

Defined in: [packages/esm-api/src/openmrs-fetch.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/openmrs-fetch.ts#L8)

___

### userHasAccess

▸ **userHasAccess**(`requiredPrivilege`: *string*, `user`: [*LoggedInUser*](interfaces/loggedinuser.md)): *undefined* \| [*Privilege*](interfaces/privilege.md)

#### Parameters:

Name | Type |
:------ | :------ |
`requiredPrivilege` | *string* |
`user` | [*LoggedInUser*](interfaces/loggedinuser.md) |

**Returns:** *undefined* \| [*Privilege*](interfaces/privilege.md)

Defined in: [packages/esm-api/src/shared-api-objects/current-user.ts:121](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/shared-api-objects/current-user.ts#L121)

___

## Workspace Functions

### getNewWorkspaceItem

▸ **getNewWorkspaceItem**(): *Observable*<[*WorkspaceItem*](interfaces/workspaceitem.md)\>

**Returns:** *Observable*<[*WorkspaceItem*](interfaces/workspaceitem.md)\>

Defined in: [packages/esm-api/src/workspace/workspace.resource.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/workspace/workspace.resource.tsx#L19)

___

### newWorkspaceItem

▸ **newWorkspaceItem**(`item`: [*WorkspaceItem*](interfaces/workspaceitem.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | [*WorkspaceItem*](interfaces/workspaceitem.md) |

**Returns:** *void*

Defined in: [packages/esm-api/src/workspace/workspace.resource.tsx:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/workspace/workspace.resource.tsx#L10)
