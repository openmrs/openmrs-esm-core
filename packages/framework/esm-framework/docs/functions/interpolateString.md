[O3 Framework](../API.md) / interpolateString

# Function: interpolateString()

> **interpolateString**(`template`, `params`): `string`

Defined in: [packages/framework/esm-navigation/src/navigation/interpolate-string.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-navigation/src/navigation/interpolate-string.ts#L60)

Interpolates values of `params` into the `template` string.

Example usage:
```js
interpolateString("test ${one} ${two} 3", {
   one: "1",
   two: "2",
}); // will return "test 1 2 3"
interpolateString("test ok", { one: "1", two: "2" }) // will return "test ok"
```

## Parameters

### template

`string`

With optional params wrapped in `${ }`

### params

Values to interpolate into the string template

## Returns

`string`
