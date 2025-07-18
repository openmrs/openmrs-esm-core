[O3 Framework](../API.md) / ExtensionSlot

# Function: ExtensionSlot()

> **ExtensionSlot**(`__namedParameters`): `Element`

Defined in: [packages/framework/esm-react-utils/src/ExtensionSlot.tsx:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ExtensionSlot.tsx#L71)

An [extension slot](https://o3-docs.openmrs.org/docs/extension-system).
A place with a name. Extensions that get connected to that name
will be rendered into this.

## Parameters

### \_\_namedParameters

[`ExtensionSlotProps`](../interfaces/ExtensionSlotProps.md)

## Returns

`Element`

## Examples

Passing a react node as children

```tsx
<ExtensionSlot name="Foo">
  <div style={{ width: 10rem }}>
    <Extension />
  </div>
</ExtensionSlot>
```

Passing a function as children

```tsx
<ExtensionSlot name="Bar">
  {(extension) => (
    <h1>{extension.name}</h1>
    <div style={{ color: extension.meta.color }}>
      <Extension />
    </div>
  )}
</ExtensionSlot>
```
