[O3 Framework](../API.md) / useLeftNav

# Function: useLeftNav()

> **useLeftNav**(`params`): `void`

Defined in: [packages/framework/esm-react-utils/src/useLeftNav.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useLeftNav.ts#L26)

A React hook that registers a left navigation menu for the current component.
The navigation is automatically registered when the component mounts and
unregistered when it unmounts.

**Important:** This hook should only be used in "page" components, not in
"extension" components. Extensions should not control the left navigation.

## Parameters

### params

`Omit`\<`SetLeftNavParams`, `"module"`\>

Configuration parameters for the left navigation, excluding the
  module name which is automatically determined from the component context.

## Returns

`void`

## Example

```tsx
import { useLeftNav } from '@openmrs/esm-framework';
function MyPageComponent() {
  useLeftNav({ name: 'my-nav', slots: ['nav-slot-1', 'nav-slot-2'] });
  return <div>My Page</div>;
}
```
