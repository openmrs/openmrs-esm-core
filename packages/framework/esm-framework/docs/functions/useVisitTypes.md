[O3 Framework](../API.md) / useVisitTypes

# Function: useVisitTypes()

> **useVisitTypes**(): [`VisitType`](../interfaces/VisitType.md)[]

Defined in: [packages/framework/esm-react-utils/src/useVisitTypes.ts:27](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisitTypes.ts#L27)

A React hook that fetches and returns all available visit types from the
OpenMRS server. The data is fetched once when the component mounts.

## Returns

[`VisitType`](../interfaces/VisitType.md)[]

An array of VisitType objects. Returns an empty array while loading
  or if an error occurs.

## Example

```tsx
import { useVisitTypes } from '@openmrs/esm-framework';
function VisitTypeSelector() {
  const visitTypes = useVisitTypes();
  return (
    <select>
      {visitTypes.map((vt) => (
        <option key={vt.uuid} value={vt.uuid}>{vt.display}</option>
      ))}
    </select>
  );
}
```
