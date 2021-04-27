import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  getVisitsForPatient,
  getStartedVisit,
  VisitMode,
  VisitStatus,
  Visit,
} from "@openmrs/esm-api";

export function useVisit(patientUuid: string) {
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const sub = getVisitsForPatient(patientUuid, abortController).subscribe(
      ({ data }) => {
        const currentVisit = data.results.find(
          (visit) =>
            dayjs(visit.startDatetime).format("DD-MM-YYYY") ===
            dayjs(new Date()).format("DD-MM-YYYY")
        );

        if (currentVisit) {
          getStartedVisit.next({
            mode: VisitMode.LOADING,
            visitData: currentVisit,
            status: VisitStatus.ONGOING,
          });
          setCurrentVisit(currentVisit);
        }
      },
      setError
    );
    return () => sub && sub.unsubscribe();
  }, [patientUuid]);

  return { currentVisit, error };
}
