[Back to README.md](../README.md)

# @openmrs/esm-breadcrumbs

## Table of contents

### Interfaces

- [BreadcrumbRegistration](interfaces/breadcrumbregistration.md)
- [BreadcrumbSettings](interfaces/breadcrumbsettings.md)

### Breadcrumb Functions

- [filterBreadcrumbs](API.md#filterbreadcrumbs)
- [getBreadcrumbs](API.md#getbreadcrumbs)
- [getBreadcrumbsFor](API.md#getbreadcrumbsfor)
- [registerBreadcrumb](API.md#registerbreadcrumb)
- [registerBreadcrumbs](API.md#registerbreadcrumbs)

## Breadcrumb Functions

### filterBreadcrumbs

▸ **filterBreadcrumbs**(`list`: [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[], `path`: *string*): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

#### Parameters:

| Name | Type |
| :------ | :------ |
| `list` | [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[] |
| `path` | *string* |

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [filter.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/filter.ts#L49)

___

### getBreadcrumbs

▸ **getBreadcrumbs**(): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [db.ts:50](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/db.ts#L50)

___

### getBreadcrumbsFor

▸ **getBreadcrumbsFor**(`path`: *string*): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

#### Parameters:

| Name | Type |
| :------ | :------ |
| `path` | *string* |

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [filter.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/filter.ts#L78)

___

### registerBreadcrumb

▸ **registerBreadcrumb**(`breadcrumb`: [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `breadcrumb` | [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md) |

**Returns:** *void*

Defined in: [db.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/db.ts#L26)

___

### registerBreadcrumbs

▸ **registerBreadcrumbs**(`breadcrumbs`: [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)[]): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `breadcrumbs` | [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)[] |

**Returns:** *void*

Defined in: [db.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/db.ts#L35)
