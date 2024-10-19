/** @module @category UI */
import { ExtensionSlot } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { age, formatDate, parseDate } from '@openmrs/esm-utils';
import classNames from 'classnames';
import React from 'react';
import PatientBannerPatientIdentifier from './patient-banner-patient-identifiers.component';
import styles from './patient-banner-patient-info.module.scss';

export interface PatientBannerPatientInfoProps {
  patient: fhir.Patient;
}

export function PatientBannerPatientInfo({ patient }: PatientBannerPatientInfoProps) {
  const name = `${patient?.name?.[0]?.given?.join(' ')} ${patient?.name?.[0].family}`;
  const gender = patient?.gender && getGender(patient.gender);

  return (
    <div className={styles.patientInfo}>
      <div className={classNames(styles.row, styles.patientNameRow)}>
        <div className={styles.flexRow}>
          <span className={styles.patientName}>{name}</span>
          <ExtensionSlot
            name="patient-banner-tags-slot"
            state={{ patientUuid: patient.id, patient }}
            className={styles.flexRow}
          />
        </div>
      </div>
      <div className={styles.demographics}>
        <span>{gender}</span>
        {patient.birthDate && (
          <>
            <span className={styles.separator}>&middot;</span>
            <span>{age(patient.birthDate)}</span>
            <span className={styles.separator}>&middot;</span>
            <span>{formatDate(parseDate(patient.birthDate), { mode: 'wide', time: false })}</span>
          </>
        )}
      </div>
      <div className={styles.row}>
        <PatientBannerPatientIdentifier identifier={patient.identifier} showIdentifierLabel={true} />
      </div>
    </div>
  );
}

const getGender = (gender: string): string => {
  switch (gender) {
    case 'male':
      return getCoreTranslation('male', 'Male');
    case 'female':
      return getCoreTranslation('female', 'Female');
    case 'other':
      return getCoreTranslation('other', 'Other');
    case 'unknown':
      return getCoreTranslation('unknown', 'Unknown');
    default:
      return gender;
  }
};
