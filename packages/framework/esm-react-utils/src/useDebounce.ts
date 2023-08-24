import { useEffect, useState } from "react";

/**
 * This hook will help us out in getting the debounced value of a state variable,
 * which then makes a request to the backend.
 * 
 * For example,
 * 
 * ```tsx
 * import { useDebounceValue } from "@openmrs/esm-react-utils";
 * 
 * function MyComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm);
 *   const swrResult = useSWR(`/api/search?q=${debouncedSearchTerm}`) 
 * 
 *  return (
 *    <Search
        labelText={t('search', 'Search')}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
 *  )
 * }
 * 
 * ```
 * 
 * @param value
 * @param delay number = 300
 * @returns debounceValue
 */
export function useDebounceValue<T>(value: T, delay: number = 300) {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debounceValue;
}
