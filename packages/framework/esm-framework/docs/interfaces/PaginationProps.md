[O3 Framework](../API.md) / PaginationProps

# Interface: PaginationProps

Defined in: [packages/framework/esm-styleguide/src/pagination/pagination.component.tsx:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pagination/pagination.component.tsx#L8)

## Properties

### currentItems

> **currentItems**: `number`

Defined in: [packages/framework/esm-styleguide/src/pagination/pagination.component.tsx:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pagination/pagination.component.tsx#L10)

The count of current items displayed

***

### dashboardLinkLabel?

> `optional` **dashboardLinkLabel**: `string`

Defined in: [packages/framework/esm-styleguide/src/pagination/pagination.component.tsx:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pagination/pagination.component.tsx#L22)

Optional text to display instead of the default "See all"

***

### dashboardLinkUrl?

> `optional` **dashboardLinkUrl**: `string`

Defined in: [packages/framework/esm-styleguide/src/pagination/pagination.component.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pagination/pagination.component.tsx#L20)

An optional URL the user should be directed to if they click on the link to see all results

***

### onPageNumberChange()?

> `optional` **onPageNumberChange**: (`data`) => `void`

Defined in: [packages/framework/esm-styleguide/src/pagination/pagination.component.tsx:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pagination/pagination.component.tsx#L18)

A callback to be called when the page changes

#### Parameters

##### data

###### page

`number`

###### pageSize

`number`

###### ref?

`RefObject`\<`any`\>

#### Returns

`void`

***

### pageNumber

> **pageNumber**: `number`

Defined in: [packages/framework/esm-styleguide/src/pagination/pagination.component.tsx:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pagination/pagination.component.tsx#L14)

The current page number

***

### pageSize

> **pageSize**: `number`

Defined in: [packages/framework/esm-styleguide/src/pagination/pagination.component.tsx:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pagination/pagination.component.tsx#L16)

The size of each page

***

### totalItems

> **totalItems**: `number`

Defined in: [packages/framework/esm-styleguide/src/pagination/pagination.component.tsx:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pagination/pagination.component.tsx#L12)

The count of total items displayed
