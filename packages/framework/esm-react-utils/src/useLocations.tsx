/** @module @category API */
import { getLocations, Location } from "@openmrs/esm-api";
import { useState, useEffect } from "react";

export function useLocations() {
  const [locations, setLocations] = useState<Array<Location>>([]);

  useEffect(() => {
    const locationSub = getLocations().subscribe(
      (locations) => {
        setLocations(locations);
      },
      (error) => {
        console.error(error);
      }
    );
    return () => locationSub.unsubscribe();
  }, []);

  return locations;
}
