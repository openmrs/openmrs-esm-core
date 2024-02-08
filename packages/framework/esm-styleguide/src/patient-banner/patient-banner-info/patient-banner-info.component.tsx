import { age, formatDate, parseDate, translateFrom } from '@openmrs/esm-framework';
import { ExtensionSlot, useConfig } from '@openmrs/esm-react-utils';
import React from 'react';
import classNames from 'classnames';
import { Tag } from '@carbon/react';
import styles from './patient-banner-info.module.scss';

export interface PatientBannerPatientInfoProps {
  patientUuid: string;
  name: string;
  gender: string;
  identifiers: Array<{ value: string; type: string; typeUuid: string }>;
  birthDate: string;
  deathDate: string | null;
}

export function PatientBannerPatientInfo({
  patientUuid,
  name,
  gender,
  identifiers,
  birthDate,
  deathDate,
}: PatientBannerPatientInfoProps) {
  const { excludePatientIdentifierCodeTypes } = useConfig();

  const filteredIdentifiers =
    identifiers.filter((identifier) => !excludePatientIdentifierCodeTypes?.uuids.includes(identifier.typeUuid)) ?? [];

  return (
    <div className={styles.patientInfo}>
      <div className={classNames(styles.row, styles.patientNameRow)}>
        <div className={styles.flexRow}>
          <span className={styles.patientName}>{name}</span>
          {/* TODO: The fhir Patient passed in the state to the patient-banner-tags-slot is
          totally unused other than the death date, which is used as a boolean to
          tell if a patient is dead. We should eventually try to get rid of it and
          just provide `isDeceased` as state. */}
          <ExtensionSlot
            name="patient-banner-tags-slot"
            state={{ patientUuid, patient: { deceasedDateTime: deathDate } }}
            className={styles.flexRow}
          />
        </div>
      </div>
      <div className={styles.demographics}>
        <span>{getGender(gender)}</span> &middot; <span>{age(birthDate)}</span> &middot;{' '}
        <span>{formatDate(parseDate(birthDate), { mode: 'wide', time: false })}</span>
      </div>
      <div className={styles.row}>
        <div className={styles.identifiers}>
          {filteredIdentifiers?.length
            ? filteredIdentifiers.map(({ value, type }) => (
                <span key={value} className={styles.identifierTag}>
                  <Tag className={styles.tag} type="gray" title={type}>
                    {type}
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
