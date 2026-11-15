[O3 Framework](../API.md) / useRenderableExtensions

# Function: useRenderableExtensions()

> **useRenderableExtensions**(`name`): `FC`\<`Pick`\<[`ExtensionProps`](../type-aliases/ExtensionProps.md), `"state"`\>\>[]

Defined in: [packages/framework/esm-react-utils/src/useRenderableExtensions.tsx:121](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useRenderableExtensions.tsx#L121)

This is an advanced hook for use-cases where its useful to use the extension system,
but not the `ExtensionSlot` component's rendering of extensions. Use of this hook
should be avoided if possible.

Functionally, this hook is very similar to the `ExtensionSlot` component, but whereas
an `ExtensionSlot` renders a DOM tree of extensions bound to the slot, this hook simply
returns the extensions as an array of React components that can be wired into a component
however makes sense.

Each extension keeps the same component for as long as it stays in the slot, so passing it new
state updates the mounted extension rather than remounting it.

## Parameters

### name

`string`

The name of the extension slot

## Returns

`FC`\<`Pick`\<[`ExtensionProps`](../type-aliases/ExtensionProps.md), `"state"`\>\>[]

## Example

```ts
const extensions = useRenderableExtensions('my-extension-slot');
return (
 <>
   {extensions.map((Ext, index) => (
     <React.Fragment key={index}>
       <Ext state={{key: 'value'}} />
     </React.Fragment>
   ))}
 </>
)
```
