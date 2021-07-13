import { getLocations, Location } from "@openmrs/esm-api";
import { useState, useEffect } from "react";

export function useLocations() {
  const [locations, setLocations] = useState<Array<Location>>([]);

  useEffect(() => {
    const abort = new AbortController();
    getLocations(abort).then(setLocations, console.error);
    return () => abort.abort();
  }, []);

  return locations;
}
