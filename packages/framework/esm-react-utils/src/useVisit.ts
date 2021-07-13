import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getVisitsForPatient, Visit } from "@openmrs/esm-api";

export function useVisit(patientUuid: string) {
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    getVisitsForPatient(patientUuid, ac).then(({ results }) => {
      const currentVisit = results.find(
        (visit) =>
          dayjs(visit.startDatetime).format("DD-MM-YYYY") ===
          dayjs(new Date()).format("DD-MM-YYYY")
      );

      if (currentVisit) {
        setCurrentVisit(currentVisit);
      }
    });
    return () => ac.abort();
  }, [patientUuid]);

  return currentVisit;
}
