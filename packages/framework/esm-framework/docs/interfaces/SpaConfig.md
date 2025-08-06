[O3 Framework](../API.md) / SpaConfig

# Interface: SpaConfig

Defined in: packages/framework/esm-globals/dist/types.d.ts:79

The configuration passed to the app shell initialization function

## Properties

### apiUrl

> **apiUrl**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:83

The base path or URL for the OpenMRS API / endpoints.

***

### configUrls?

> `optional` **configUrls**: `string`[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:96

URLs of configurations to load in the system.

***

### env?

> `optional` **env**: [`SpaEnvironment`](../type-aliases/SpaEnvironment.md)

Defined in: packages/framework/esm-globals/dist/types.d.ts:92

The environment to use.

#### Default

```ts
production
```

***

### offline?

> `optional` **offline**: `boolean`

Defined in: packages/framework/esm-globals/dist/types.d.ts:101

Defines if offline should be supported by installing a service worker.

#### Default

```ts
true
```

***

### spaPath

> **spaPath**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:87

The base path for the SPA root path.
