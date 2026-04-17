/** @module @category API */
import { useState, useEffect } from 'react';
import { getLocations, type Location } from '@openmrs/esm-emr-api';

/**
 * A React hook that fetches and returns locations from the OpenMRS server.
 * Locations can be filtered by a tag UUID/name and/or a search query string.
 *
 * @param tagUuidOrName Optional tag UUID or name to filter locations by.
 *   Pass `null` to not filter by tag.
 * @param query Optional search query string to filter locations. Pass `null`
 *   to not filter by query.
 * @returns An array of Location objects. Returns an empty array while loading
 *   or if an error occurs.
 *
 * @example
 * ```tsx
 * import { useLocations } from '@openmrs/esm-framework';
 * function LocationList() {
 *   const locations = useLocations('Login Location');
 *   return (
 *     <ul>
 *       {locations.map((loc) => <li key={loc.uuid}>{loc.display}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useLocations(tagUuidOrName: string | null = null, query: string | null = null): Array<Location> {
  const [locations, setLocations] = useState<Array<Location>>([]);

  useEffect(() => {
    const locationSub = getLocations(tagUuidOrName, query).subscribe(
      (locations) => {
        setLocations(locations);
      },
      (error) => {
        console.error(error);
      },
    );
    return () => locationSub.unsubscribe();
  }, [tagUuidOrName, query]);

  return locations;
}
