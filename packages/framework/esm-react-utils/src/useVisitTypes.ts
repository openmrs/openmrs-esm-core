/** @module @category API */
import { getVisitTypes, VisitType } from "@openmrs/esm-api";
import { useEffect, useState } from "react";

export function useVisitTypes() {
  const [visitTypes, setVisitTypes] = useState<Array<VisitType>>([]);

  useEffect(() => {
    const visitTypesSub = getVisitTypes().subscribe(
      (visitTypes) => {
        setVisitTypes(visitTypes);
      },
      (error) => console.error(error)
    );

    return () => visitTypesSub.unsubscribe();
  }, []);

  return visitTypes;
}
