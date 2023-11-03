[@openmrs/esm-framework](../API.md) / OpenmrsAppRoutes

# Interface: OpenmrsAppRoutes

This interface describes the format of the routes provided by an app

## Table of contents

### Properties

- [backendDependencies](OpenmrsAppRoutes.md#backenddependencies)
- [extensions](OpenmrsAppRoutes.md#extensions)
- [pages](OpenmrsAppRoutes.md#pages)
- [version](OpenmrsAppRoutes.md#version)

## Properties

### backendDependencies

• `Optional` **backendDependencies**: `Record`<`string`, `string`\>

A list of backend modules necessary for this frontend module and the corresponding required versions.

#### Defined in

[packages/framework/esm-globals/src/types.ts:240](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L240)

___

### extensions

• `Optional` **extensions**: [`ExtensionDefinition`](../API.md#extensiondefinition)[]

An array of all extensions supported by this frontend module. Extensions can be mounted in extension slots, either via declarations in this file or configuration.

#### Defined in

[packages/framework/esm-globals/src/types.ts:248](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L248)

___

### pages

• `Optional` **pages**: [`PageDefinition`](../API.md#pagedefinition)[]

An array of all pages supported by this frontend module. Pages are automatically mounted based on a route.

#### Defined in

[packages/framework/esm-globals/src/types.ts:244](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L244)

___

### version

• `Optional` **version**: `string`

The version of this frontend module.

#### Defined in

[packages/framework/esm-globals/src/types.ts:236](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L236)
