[O3 Framework](../API.md) / useDebounce

# Function: useDebounce()

> **useDebounce**\<`T`\>(`value`, `delay`): `T`

Defined in: [packages/framework/esm-react-utils/src/useDebounce.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useDebounce.ts#L32)

This hook debounces a state variable. That state variable can then be used as the
value of a controlled input, while the return value of this hook is used for making
a request.

## Type Parameters

### T

`T`

## Parameters

### value

`T`

The value that will be used to set `debounceValue`

### delay

`number` = `300`

The number of milliseconds to wait before updating `debounceValue`

## Returns

`T`

The debounced value

## Example

```tsx
import { useDebounce } from "@openmrs/esm-framework";

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const swrResult = useSWR(`/api/search?q=${debouncedSearchTerm}`)

 return (
   <Search
     labelText={t('search', 'Search')}
     onChange={(e) => setSearchTerm(e.target.value)}
     value={searchTerm}
   />
 )
}
```
