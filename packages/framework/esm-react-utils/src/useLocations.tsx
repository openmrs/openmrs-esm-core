/** @module @category API */
import type { Location } from '@openmrs/esm-api';
import { getLocations } from '@openmrs/esm-api';
import { useState, useEffect } from 'react';

export function useLocations(tagUuidOrName: string | null = null) {
  const [locations, setLocations] = useState<Array<Location>>([]);

  useEffect(() => {
    const locationSub = getLocations(tagUuidOrName).subscribe(
      (locations) => {
        setLocations(locations);
      },
      (error) => {
        console.error(error);
      },
    );
    return () => locationSub.unsubscribe();
  }, []);

  return locations;
}
