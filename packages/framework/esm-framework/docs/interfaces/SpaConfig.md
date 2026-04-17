[O3 Framework](../API.md) / SpaConfig

# Interface: SpaConfig

Defined in: [packages/framework/esm-globals/src/types.ts:68](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L68)

The configuration passed to the app shell initialization function

## Properties

### apiUrl

> **apiUrl**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L72)

The base path or URL for the OpenMRS API / endpoints.

***

### configUrls?

> `optional` **configUrls**: `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L85)

URLs of configurations to load in the system.

***

### env?

> `optional` **env**: [`SpaEnvironment`](../type-aliases/SpaEnvironment.md)

Defined in: [packages/framework/esm-globals/src/types.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L81)

The environment to use.

#### Default

```ts
production
```

***

### offline?

> `optional` **offline**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:90](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L90)

Defines if offline should be supported by installing a service worker.

#### Default

```ts
true
```

***

### spaPath

> **spaPath**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:76](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L76)

The base path for the SPA root path.
