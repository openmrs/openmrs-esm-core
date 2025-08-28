[O3 Framework](../API.md) / LoggedInUser

# Interface: LoggedInUser

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L14)

## Indexable

\[`anythingElse`: `string`\]: `any`

## Properties

### allowedLocales

> **allowedLocales**: `string`[]

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L45)

***

### display

> **display**: `string`

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L16)

***

### locale

> **locale**: `string`

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L44)

***

### person

> **person**: [`Person`](Person.md)

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L40)

***

### privileges

> **privileges**: [`Privilege`](Privilege.md)[]

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L41)

***

### retired

> **retired**: `boolean`

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L43)

***

### roles

> **roles**: [`Role`](Role.md)[]

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L42)

***

### systemId

> **systemId**: `string`

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L18)

***

### username

> **username**: `string`

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L17)

***

### userProperties

> **userProperties**: `null` \| \{[`key`: `string`]: `undefined` \| `string`; `defaultLocation?`: `string`; `patientsVisited?`: `string`; `starredPatientLists?`: `string`; \}

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L19)

#### Type declaration

`null`

\{[`key`: `string`]: `undefined` \| `string`; `defaultLocation?`: `string`; `patientsVisited?`: `string`; `starredPatientLists?`: `string`; \}

#### Index Signature

\[`key`: `string`\]: `undefined` \| `string`

#### defaultLocation?

> `optional` **defaultLocation**: `string`

The UUID of the location the user has set preference to use for next logins

#### patientsVisited?

> `optional` **patientsVisited**: `string`

The UUIDs of patients the user has visited
Separated by commas
To get the array, do `user.userProperties.patientsVisited.split(',')`
To store the array, do `patientsVisited: patientsVisited.join(',')`

#### starredPatientLists?

> `optional` **starredPatientLists**: `string`

The UUIDs of patient lists the user has starred
Separated by commas
To get the array, do `user.userProperties.starredPatientLists.split(',')`
To store the array, perform `starredPatientLists: starredPatientLists.join(',')`

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/user-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L15)
