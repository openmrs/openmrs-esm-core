[O3 Framework](../API.md) / useBodyScrollLock

# Function: useBodyScrollLock()

> **useBodyScrollLock**(`active`): `void`

Defined in: [packages/framework/esm-react-utils/src/useBodyScrollLock.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useBodyScrollLock.ts#L22)

A React hook that prevents scrolling on the document body when active.
Useful for modals, overlays, or any full-screen UI that should prevent
background scrolling. The original overflow style is restored when the
hook becomes inactive or the component unmounts.

## Parameters

### active

`boolean`

Whether to lock the body scroll. When `true`, sets
  `document.body.style.overflow` to 'hidden'.

## Returns

`void`

## Example

```tsx
import { useBodyScrollLock } from '@openmrs/esm-framework';
function Modal({ isOpen }) {
  useBodyScrollLock(isOpen);
  return isOpen ? <div className="modal">...</div> : null;
}
```
