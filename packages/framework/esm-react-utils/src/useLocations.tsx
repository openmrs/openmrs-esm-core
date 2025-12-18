/** @module @category API */
import { useState, useEffect } from 'react';
import { getLocations, type Location } from '@openmrs/esm-emr-api';

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
