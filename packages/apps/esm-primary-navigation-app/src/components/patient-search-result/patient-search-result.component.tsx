import React from "react";
import dayjs from "dayjs";
import styles from "./patient-search-result.scss";
import {
  interpolateString,
  ConfigurableLink,
  ExtensionSlot,
  useConfig,
  navigate,
} from "@openmrs/esm-framework";
import { SearchedPatient } from "../../types";

const PatientSearchResults: React.FC<PatientSearchResultsProps> = ({
  patients,
  hidePanel,
}) => {
  const config = useConfig();

  function renderPatient(patient: SearchedPatient) {
    const preferredIdentifier =
      patient.identifiers.find((i) => i.preferred) || patient.identifiers[0];

    return (
      <div
        key={patient.display}
        role="button"
        tabIndex={0}
        className={styles.patientCharts}
        onClick={() => {
          navigate({
            to: interpolateString(config.search.patientResultUrl, {
              patientUuid: patient.uuid,
            }),
          });
          hidePanel();
        }}
      >
        <div className={styles.container}>
          <div className={styles.patientBanner}>
            <div className={styles.patientAvatar}>
              <ExtensionSlot
                extensionSlotName="patient-photo-slot"
                state={{ patientUuid: patient.uuid }}
              />
            </div>
            <div className={styles.patientInfo}>
              <div>
                <span className={styles.patientName}>
                  {patient.person.display}
                </span>
              </div>
              <div className={styles.demographics}>
                <span>{patient.person.gender === "M" ? "Male" : "Female"}</span>{" "}
                &middot;{" "}
                <span>
                  {patient.person.age}{" "}
                  {patient.person.age === 1 ? "year" : "years"}
                </span>{" "}
                &middot;{" "}
                <span>
                  {dayjs(patient.person.birthdate).format("DD - MMM - YYYY")}
                </span>
              </div>
              <div>
                <span className={styles.identifiers}>
                  {preferredIdentifier.identifier}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{patients.map((patient) => renderPatient(patient))}</>;
};

interface PatientSearchResultsProps {
  patients: Array<SearchedPatient>;
  searchTerm: string;
  hidePanel?: any;
}

export default PatientSearchResults;
