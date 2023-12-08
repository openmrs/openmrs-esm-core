/** @module @category Utility */
import { useEffect, useState } from 'react';

/**
 * This hook debounces a state variable. That state variable can then be used as the
 * value of a controlled input, while the return value of this hook is used for making
 * a request.
 *
 * @example
 * ```tsx
 * import { useDebounce } from "@openmrs/esm-framework";
 *
 * function MyComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm);
 *   const swrResult = useSWR(`/api/search?q=${debouncedSearchTerm}`)
 *
 *  return (
 *    <Search
 *      labelText={t('search', 'Search')}
 *      onChange={(e) => setSearchTerm(e.target.value)}
 *      value={searchTerm}
 *    />
 *  )
 * }
 * ```
 *
 * @param value The value that will be used to set `debounceValue`
 * @param delay The number of milliseconds to wait before updating `debounceValue`
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300) {
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
