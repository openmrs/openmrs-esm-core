[O3 Framework](../API.md) / useLocations

# Function: useLocations()

> **useLocations**(`tagUuidOrName`, `query`): `Location`[]

Defined in: [packages/framework/esm-react-utils/src/useLocations.tsx:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useLocations.tsx#L29)

A React hook that fetches and returns locations from the OpenMRS server.
Locations can be filtered by a tag UUID/name and/or a search query string.

## Parameters

### tagUuidOrName

Optional tag UUID or name to filter locations by.
  Pass `null` to not filter by tag.

`null` | `string`

### query

Optional search query string to filter locations. Pass `null`
  to not filter by query.

`null` | `string`

## Returns

`Location`[]

An array of Location objects. Returns an empty array while loading
  or if an error occurs.

## Example

```tsx
import { useLocations } from '@openmrs/esm-framework';
function LocationList() {
  const locations = useLocations('Login Location');
  return (
    <ul>
      {locations.map((loc) => <li key={loc.uuid}>{loc.display}</li>)}
    </ul>
  );
}
```
