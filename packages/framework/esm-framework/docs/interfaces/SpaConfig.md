[O3 Framework](../API.md) / SpaConfig

# Interface: SpaConfig

Defined in: [packages/framework/esm-globals/src/types.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L71)

The configuration passed to the app shell initialization function

## Properties

### apiUrl

> **apiUrl**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L75)

The base path or URL for the OpenMRS API / endpoints.

***

### configUrls?

> `optional` **configUrls**: `string`[]

Defined in: [packages/framework/esm-globals/src/types.ts:88](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L88)

URLs of configurations to load in the system.

***

### env?

> `optional` **env**: [`SpaEnvironment`](../type-aliases/SpaEnvironment.md)

Defined in: [packages/framework/esm-globals/src/types.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L84)

The environment to use.

#### Default

```ts
production
```

***

### offline?

> `optional` **offline**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L93)

Defines if offline should be supported by installing a service worker.

#### Default

```ts
true
```

***

### spaPath

> **spaPath**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:79](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L79)

The base path for the SPA root path.
