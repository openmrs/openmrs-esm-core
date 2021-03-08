[@openmrs/esm-framework](../API.md) / BreadcrumbSettings

# Interface: BreadcrumbSettings

## Table of contents

### Properties

- [matcher](breadcrumbsettings.md#matcher)
- [parent](breadcrumbsettings.md#parent)
- [path](breadcrumbsettings.md#path)
- [title](breadcrumbsettings.md#title)

## Properties

### matcher

• `Optional` **matcher**: *undefined* \| *string* \| *RegExp*

A string or RegEx that determines whether the breadcrumb should be displayed.
It is tested against the current location's path.

If `matcher` is a string, it can contain route parameters. e.g. `/foo/:bar`.

Can be omitted; the value of `path` is used as the default value.

Defined in: [packages/esm-api/src/breadcrumbs/types.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/breadcrumbs/types.ts#L14)

___

### parent

• `Optional` **parent**: *undefined* \| *string*

The breadcrumb's parent breadcrumb. Supply the path of the breadcrumb here, e.g.,
if we are currently in "/foo/bar", you could provide "/foo" to get the breadcrumb
associated with the path "/foo".

If a path is missing for some reason, the closest matching one will be taken as
parent.

Defined in: [packages/esm-api/src/breadcrumbs/types.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/breadcrumbs/types.ts#L23)

___

### path

• **path**: *string*

Gets the path of breadcrumb for navigation purposes.

Defined in: [packages/esm-api/src/breadcrumbs/types.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/breadcrumbs/types.ts#L5)

___

### title

• **title**: *string*

The title of the breadcrumb.

Defined in: [packages/esm-api/src/breadcrumbs/types.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/breadcrumbs/types.ts#L27)
