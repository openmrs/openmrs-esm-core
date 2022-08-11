[@openmrs/esm-framework](../API.md) / BreadcrumbSettings

# Interface: BreadcrumbSettings

## Table of contents

### Breadcrumb Properties

- [matcher](BreadcrumbSettings.md#matcher)
- [parent](BreadcrumbSettings.md#parent)
- [path](BreadcrumbSettings.md#path)
- [title](BreadcrumbSettings.md#title)

## Breadcrumb Properties

### matcher

• `Optional` **matcher**: `string` \| `RegExp`

A string or RegEx that determines whether the breadcrumb should be displayed.
It is tested against the current location's path.

If `matcher` is a string, it can contain route parameters. e.g. `/foo/:bar`.

Can be omitted; the value of `path` is used as the default value.

#### Defined in

[packages/framework/esm-breadcrumbs/src/types.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/types.ts#L16)

___

### parent

• `Optional` **parent**: `string`

The breadcrumb's parent breadcrumb. Supply the path of the breadcrumb here, e.g.,
if we are currently in "/foo/bar", you could provide "/foo" to get the breadcrumb
associated with the path "/foo".

If a path is missing for some reason, the closest matching one will be taken as
parent.

#### Defined in

[packages/framework/esm-breadcrumbs/src/types.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/types.ts#L25)

___

### path

• **path**: `string`

Gets the path of breadcrumb for navigation purposes.

#### Defined in

[packages/framework/esm-breadcrumbs/src/types.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/types.ts#L7)

___

### title

• **title**: `string` \| (`params`: `any`) => `string` \| (`params`: `any`) => `Promise`<`string`\>

The title of the breadcrumb.

#### Defined in

[packages/framework/esm-breadcrumbs/src/types.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-breadcrumbs/src/types.ts#L29)
