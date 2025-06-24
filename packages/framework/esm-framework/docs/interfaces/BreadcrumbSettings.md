[O3 Framework](../API.md) / BreadcrumbSettings

# Interface: BreadcrumbSettings

Defined in: [packages/framework/esm-navigation/src/types.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-navigation/src/types.ts#L3)

## Properties

### matcher?

> `optional` **matcher**: `string` \| `RegExp`

Defined in: [packages/framework/esm-navigation/src/types.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-navigation/src/types.ts#L16)

A string or RegEx that determines whether the breadcrumb should be displayed.
It is tested against the current location's path.

If `matcher` is a string, it can contain route parameters. e.g. `/foo/:bar`.

Can be omitted; the value of `path` is used as the default value.

***

### parent?

> `optional` **parent**: `string`

Defined in: [packages/framework/esm-navigation/src/types.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-navigation/src/types.ts#L25)

The breadcrumb's parent breadcrumb. Supply the path of the breadcrumb here, e.g.,
if we are currently in "/foo/bar", you could provide "/foo" to get the breadcrumb
associated with the path "/foo".

If a path is missing for some reason, the closest matching one will be taken as
parent.

***

### path

> **path**: `string`

Defined in: [packages/framework/esm-navigation/src/types.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-navigation/src/types.ts#L7)

Gets the path of breadcrumb for navigation purposes.

***

### title

> **title**: `string` \| (`params`) => `string` \| (`params`) => `Promise`\<`string`\>

Defined in: [packages/framework/esm-navigation/src/types.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-navigation/src/types.ts#L29)

The title of the breadcrumb.
