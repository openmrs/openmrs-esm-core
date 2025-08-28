[O3 Framework](../API.md) / importDynamic

# Function: importDynamic()

> **importDynamic**\<`T`\>(`jsPackage`, `share`, `options?`): `Promise`\<`T`\>

Defined in: [packages/framework/esm-dynamic-loading/src/dynamic-loading.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-dynamic-loading/src/dynamic-loading.ts#L37)

Loads the named export from a named package. This might be used like:

```js
const { someComponent } = importDynamic("@openmrs/esm-template-app")
```

## Type Parameters

### T

`T` = `any`

## Parameters

### jsPackage

`string`

The package to load the export from.

### share

`string` = `'./start'`

Indicates the name of the shared module; this is an advanced feature if the package you are loading
  doesn't use the default OpenMRS shared module name "./start".

### options?

Additional options to control loading this script.

#### importMap?

[`ImportMap`](../interfaces/ImportMap.md)

The import map to use to load the script. This is useful for situations where you're
  loading multiple scripts at a time, since it allows the calling code to supply an importMap, saving multiple
  calls to `getCurrentImportMap()`.

#### maxLoadingTime?

`number`

A positive integer representing the maximum number of milliseconds to wait for the
  script to load before the promise returned from this function will be rejected. Defaults to 600,000 milliseconds,
  i.e., 10 minutes.

## Returns

`Promise`\<`T`\>
