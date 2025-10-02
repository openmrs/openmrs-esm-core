[O3 Framework](../API.md) / OpenmrsAppRoutes

# Interface: OpenmrsAppRoutes

Defined in: packages/framework/esm-globals/dist/types.d.ts:309

This interface describes the format of the routes provided by an app

## Properties

### backendDependencies?

> `optional` **backendDependencies**: `Record`\<`string`, `string`\>

Defined in: packages/framework/esm-globals/dist/types.d.ts:313

A list of backend modules necessary for this frontend module and the corresponding required versions.

***

### extensions?

> `optional` **extensions**: [`ExtensionDefinition`](../type-aliases/ExtensionDefinition.md)[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:327

An array of all extensions supported by this frontend module. Extensions can be mounted in extension slots, either via declarations in this file or configuration.

***

### featureFlags?

> `optional` **featureFlags**: [`FeatureFlagDefinition`](FeatureFlagDefinition.md)[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:329

An array of all feature flags for any beta-stage features this module provides.

***

### modals?

> `optional` **modals**: [`ModalDefinition`](../type-aliases/ModalDefinition.md)[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:331

An array of all modals supported by this frontend module. Modals can be launched by name.

***

### optionalBackendDependencies?

> `optional` **optionalBackendDependencies**: `object`

Defined in: packages/framework/esm-globals/dist/types.d.ts:315

A list of backend modules that may enable optional functionality in this frontend module if available and the corresponding required versions.

#### Index Signature

\[`key`: `string`\]: `string` \| \{ `feature?`: [`FeatureFlagDefinition`](FeatureFlagDefinition.md); `version`: `string`; \}

The name of the backend dependency and either the required version or an object describing the required version

***

### pages?

> `optional` **pages**: [`PageDefinition`](../type-aliases/PageDefinition.md)[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:325

An array of all pages supported by this frontend module. Pages are automatically mounted based on a route.

***

### version?

> `optional` **version**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:311

The version of this frontend module.

***

### workspaceGroups?

> `optional` **workspaceGroups**: [`WorkspaceGroupDefinition`](WorkspaceGroupDefinition.md)[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:335

An array of all workspace groups supported by this frontend module.

***

### workspaces?

> `optional` **workspaces**: [`WorkspaceDefinition`](../type-aliases/WorkspaceDefinition.md)[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:333

An array of all workspaces supported by this frontend module. Workspaces can be launched by name.
