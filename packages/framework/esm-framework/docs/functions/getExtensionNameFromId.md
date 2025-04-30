[O3 Framework](../API.md) / getExtensionNameFromId

# Function: getExtensionNameFromId()

> **getExtensionNameFromId**(`extensionId`): `string`

Defined in: [packages/framework/esm-extensions/src/extensions.ts:160](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-extensions/src/extensions.ts#L160)

Given an extension ID, which is a string uniquely identifying
an instance of an extension within an extension slot, this
returns the extension name.

## Parameters

### extensionId

`string`

## Returns

`string`

## Example

```js
getExtensionNameFromId("foo#bar")
 --> "foo"
getExtensionNameFromId("baz")
 --> "baz"
```
