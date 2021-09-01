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
    const sub = getStartedVisit.subscribe((visit) => {
      if (visit) {
        setCurrentVisit(visit?.visitData ?? null);
      } else {
        setCurrentVisit(null);
      }
    });

    return () => sub.unsubscribe();
  }, [patientUuid]);

  useEffect(() => {
    const abortController = new AbortController();
    const sub = getVisitsForPatient(patientUuid, abortController).subscribe(
      ({ data }) => {
        const currentVisit = data.results.find(
          (visit) => visit.stopDatetime === null
        );

        if (currentVisit) {
          getStartedVisit.next({
            mode: VisitMode.LOADING,
            visitData: currentVisit,
            status: VisitStatus.ONGOING,
          });
        }
      },
      setError
    );
    return () => sub && sub.unsubscribe();
  }, [patientUuid]);

  return { currentVisit, error };
}
