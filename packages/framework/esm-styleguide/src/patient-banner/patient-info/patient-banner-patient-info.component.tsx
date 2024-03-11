/** @module @category UI */
import { age, formatDate, parseDate, translateFrom } from '@openmrs/esm-framework';
import { ExtensionSlot, useConfig } from '@openmrs/esm-react-utils';
import React from 'react';
import classNames from 'classnames';
import { Tag } from '@carbon/react';
import styles from './patient-banner-patient-info.module.scss';

export interface PatientBannerPatientInfoProps {
  patient: fhir.Patient;
}

export function PatientBannerPatientInfo({ patient }: PatientBannerPatientInfoProps) {
  const { excludePatientIdentifierCodeTypes } = useConfig();

  const name = `${patient?.name?.[0]?.given?.join(' ')} ${patient?.name?.[0].family}`;
  const gender = patient?.gender && getGender(patient.gender);

  const filteredIdentifiers =
    patient?.identifier?.filter(
      (identifier) => !excludePatientIdentifierCodeTypes?.uuids.includes(identifier.type?.coding?.[0]?.code),
    ) ?? [];

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
        <span>{gender}</span> &middot; <span>{patient?.birthDate && age(patient.birthDate)}</span> &middot;{' '}
        <span>{patient?.birthDate && formatDate(parseDate(patient.birthDate), { mode: 'wide', time: false })}</span>
      </div>
      <div className={styles.row}>
        <div className={styles.identifiers}>
          {filteredIdentifiers?.length
            ? filteredIdentifiers.map(({ value, type }) => (
                <span key={value} className={styles.identifierTag}>
                  <Tag className={styles.tag} type="gray" title={type?.text}>
                    {type?.text}
                  </Tag>
                  {value}
                </span>
              ))
            : ''}
        </div>
      </div>
    </div>
  );
}

const getGender = (gender: string): string => {
  // TODO: We ought to have some kind of "core translations."
  switch (gender) {
    case 'male':
      return translateFrom('@openmrs/esm-patient-banner-app', 'male', 'Male');
    case 'female':
      return translateFrom('@openmrs/esm-patient-banner-app', 'female', 'Female');
    case 'other':
      return translateFrom('@openmrs/esm-patient-banner-app', 'other', 'Other');
    case 'unknown':
      return translateFrom('@openmrs/esm-patient-banner-app', 'unknown', 'Unknown');
    default:
      return gender;
  }
};
