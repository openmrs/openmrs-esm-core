import { getVisitTypes, VisitType } from "@openmrs/esm-api";
import { useEffect, useState } from "react";

export function useVisitTypes() {
  const [visitTypes, setVisitTypes] = useState<Array<VisitType>>([]);

  useEffect(() => {
    const abort = new AbortController();
    getVisitTypes(abort).then(setVisitTypes, console.error);
    return () => abort.abort();
  }, []);

  return visitTypes;
}
