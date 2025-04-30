[O3 Framework](../API.md) / SpaConfig

# Interface: SpaConfig

Defined in: packages/framework/esm-globals/dist/types.d.ts:80

The configuration passed to the app shell initialization function

## Properties

### apiUrl

> **apiUrl**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:84

The base path or URL for the OpenMRS API / endpoints.

***

### configUrls?

> `optional` **configUrls**: `string`[]

Defined in: packages/framework/esm-globals/dist/types.d.ts:97

URLs of configurations to load in the system.

***

### env?

> `optional` **env**: [`SpaEnvironment`](../type-aliases/SpaEnvironment.md)

Defined in: packages/framework/esm-globals/dist/types.d.ts:93

The environment to use.

#### Default

```ts
production
```

***

### offline?

> `optional` **offline**: `boolean`

Defined in: packages/framework/esm-globals/dist/types.d.ts:102

Defines if offline should be supported by installing a service worker.

#### Default

```ts
true
```

***

### spaPath

> **spaPath**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:88

The base path for the SPA root path.
