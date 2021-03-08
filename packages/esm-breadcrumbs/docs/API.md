[Back to README.md](../README.md)

# @openmrs/esm-breadcrumbs

## Table of contents

### Interfaces

- [BreadcrumbRegistration](interfaces/breadcrumbregistration.md)
- [BreadcrumbSettings](interfaces/breadcrumbsettings.md)

### Functions

- [filterBreadcrumbs](API.md#filterbreadcrumbs)
- [getBreadcrumbs](API.md#getbreadcrumbs)
- [getBreadcrumbsFor](API.md#getbreadcrumbsfor)
- [registerBreadcrumb](API.md#registerbreadcrumb)
- [registerBreadcrumbs](API.md#registerbreadcrumbs)

## Functions

### filterBreadcrumbs

▸ **filterBreadcrumbs**(`list`: [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[], `path`: *string*): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

#### Parameters:

Name | Type |
:------ | :------ |
`list` | [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[] |
`path` | *string* |

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [filter.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/filter.ts#L42)

___

### getBreadcrumbs

▸ **getBreadcrumbs**(): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [db.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/db.ts#L34)

___

### getBreadcrumbsFor

▸ **getBreadcrumbsFor**(`path`: *string*): [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

#### Parameters:

Name | Type |
:------ | :------ |
`path` | *string* |

**Returns:** [*BreadcrumbRegistration*](interfaces/breadcrumbregistration.md)[]

Defined in: [filter.ts:65](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/filter.ts#L65)

___

### registerBreadcrumb

▸ **registerBreadcrumb**(`breadcrumb`: [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`breadcrumb` | [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md) |

**Returns:** *void*

Defined in: [db.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/db.ts#L20)

___

### registerBreadcrumbs

▸ **registerBreadcrumbs**(`breadcrumbs`: [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`breadcrumbs` | [*BreadcrumbSettings*](interfaces/breadcrumbsettings.md)[] |

**Returns:** *void*

Defined in: [db.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-breadcrumbs/src/db.ts#L24)
