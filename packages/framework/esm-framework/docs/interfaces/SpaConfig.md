[O3 Framework](../API.md) / SpaConfig

# Interface: SpaConfig

Defined in: [packages/framework/esm-globals/src/types.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L66)

The configuration passed to the app shell initialization function

## Properties

### apiUrl

> **apiUrl**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L70)

The base path or URL for the OpenMRS API / endpoints.

***

### configUrls?

> `optional` **configUrls**: `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:83](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L83)

URLs of configurations to load in the system.

***

### env?

> `optional` **env**: [`SpaEnvironment`](../type-aliases/SpaEnvironment.md)

Defined in: [packages/framework/esm-globals/src/types.ts:79](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L79)

The environment to use.

#### Default

```ts
production
```

***

### spaPath

> **spaPath**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L74)

The base path for the SPA root path.
