[O3 Framework](../API.md) / useOnClickOutside

# Function: useOnClickOutside()

> **useOnClickOutside**\<`T`\>(`handler`, `active`): `RefObject`\<`T`\>

Defined in: [packages/framework/esm-react-utils/src/useOnClickOutside.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOnClickOutside.ts#L31)

A React hook that detects clicks outside of a referenced element. Useful for
implementing dropdown menus, modals, or any component that should close when
clicking outside of it.

## Type Parameters

### T

`T` *extends* `HTMLElement` = `HTMLElement`

The type of HTML element the ref will be attached to.

## Parameters

### handler

(`event`) => `void`

A callback function invoked when a click occurs outside the
  referenced element.

### active

`boolean` = `true`

Whether the outside click detection is active. Defaults to `true`.
  Set to `false` to temporarily disable the detection.

## Returns

`RefObject`\<`T`\>

A React ref object to attach to the element you want to detect
  outside clicks for.

## Example

```tsx
import { useOnClickOutside } from '@openmrs/esm-framework';
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOnClickOutside<HTMLDivElement>(() => setIsOpen(false), isOpen);
  return (
    <div ref={ref}>
      {isOpen && <ul>...</ul>}
    </div>
  );
}
```
