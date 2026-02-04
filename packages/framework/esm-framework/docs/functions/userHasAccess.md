[O3 Framework](../API.md) / userHasAccess

# Function: userHasAccess()

> **userHasAccess**(`requiredPrivilege`, `user`): `boolean`

Defined in: [packages/framework/esm-api/src/current-user.ts:255](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L255)

Checks whether the given user has access based on the required privilege(s).
A user has access if they have the required privilege(s) or if they are a
"System Developer" (super user). If no privilege is required, access is granted.

## Parameters

### requiredPrivilege

A single privilege string or an array of privilege strings
  that the user must have. If an array is provided, the user must have ALL privileges.

`string` | `string`[]

### user

The user object containing their privileges and roles.

#### privileges

[`Privilege`](../interfaces/Privilege.md)[]

#### roles

[`Role`](../interfaces/Role.md)[]

## Returns

`boolean`

`true` if the user has access, `false` otherwise. Returns `true` if no
  privilege is required, and `false` if the user is undefined but a privilege is required.

## Example

```ts
import { userHasAccess } from '@openmrs/esm-api';
const hasAccess = userHasAccess('View Patients', currentUser);
const hasMultipleAccess = userHasAccess(['View Patients', 'Edit Patients'], currentUser);
```
