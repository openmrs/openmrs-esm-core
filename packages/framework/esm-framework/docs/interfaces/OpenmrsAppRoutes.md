[O3 Framework](../API.md) / OpenmrsAppRoutes

# Interface: OpenmrsAppRoutes

Defined in: [packages/framework/esm-globals/src/types.ts:373](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L373)

This interface describes the format of the routes provided by an app

## Properties

### backendDependencies?

> `optional` **backendDependencies**: `Record`\<`string`, `string`\>

Defined in: [packages/framework/esm-globals/src/types.ts:377](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L377)

A list of backend modules necessary for this frontend module and the corresponding required versions.

***

### extensions?

> `optional` **extensions**: [`ExtensionDefinition`](../type-aliases/ExtensionDefinition.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:393](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L393)

An array of all extensions supported by this frontend module. Extensions can be mounted in extension slots, either via declarations in this file or configuration.

***

### featureFlags?

> `optional` **featureFlags**: [`FeatureFlagDefinition`](FeatureFlagDefinition.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:395](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L395)

An array of all feature flags for any beta-stage features this module provides.

***

### modals?

> `optional` **modals**: [`ModalDefinition`](../type-aliases/ModalDefinition.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:397](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L397)

An array of all modals supported by this frontend module. Modals can be launched by name.

***

### optionalBackendDependencies?

> `optional` **optionalBackendDependencies**: `object`

Defined in: [packages/framework/esm-globals/src/types.ts:379](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L379)

A list of backend modules that may enable optional functionality in this frontend module if available and the corresponding required versions.

#### Index Signature

\[`key`: `string`\]: `string` \| \{ `feature?`: [`FeatureFlagDefinition`](FeatureFlagDefinition.md); `version`: `string`; \}

The name of the backend dependency and either the required version or an object describing the required version

***

### pages?

> `optional` **pages**: [`PageDefinition`](../type-aliases/PageDefinition.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:391](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L391)

An array of all pages supported by this frontend module. Pages are automatically mounted based on a route.

***

### version?

> `optional` **version**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:375](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L375)

The version of this frontend module.

***

### workspaceGroups?

> `optional` **workspaceGroups**: [`WorkspaceGroupDefinition`](WorkspaceGroupDefinition.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:401](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L401)

An array of all workspace groups supported by this frontend module.

***

### workspaceGroups2?

> `optional` **workspaceGroups2**: [`WorkspaceGroupDefinition2`](WorkspaceGroupDefinition2.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:404](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L404)

An array of all workspace groups (v2) supported by this frontend module.

***

### workspaces?

> `optional` **workspaces**: [`WorkspaceDefinition`](../type-aliases/WorkspaceDefinition.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:399](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L399)

An array of all workspaces supported by this frontend module. Workspaces can be launched by name.

***

### workspaces2?

> `optional` **workspaces2**: [`WorkspaceDefinition2`](WorkspaceDefinition2.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:410](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L410)

An array of all workspaces (v2) supported by this frontend module.

***

### workspaceWindows2?

> `optional` **workspaceWindows2**: [`WorkspaceWindowDefinition2`](WorkspaceWindowDefinition2.md)[]

Defined in: [packages/framework/esm-globals/src/types.ts:407](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L407)

An array of all workspace windows (v2) supported by this frontend module.
