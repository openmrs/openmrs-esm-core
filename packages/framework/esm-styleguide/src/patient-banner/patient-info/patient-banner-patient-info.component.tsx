/** @module @category UI */
import React from 'react';
import classNames from 'classnames';
import { Tag } from '@carbon/react';
import { age, formatDate, parseDate } from '@openmrs/esm-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { ExtensionSlot, useConfig, usePrimaryIdentifierCode } from '@openmrs/esm-react-utils';
import styles from './patient-banner-patient-info.module.scss';

export interface PatientBannerPatientInfoProps {
  patient: fhir.Patient;
}

export function PatientBannerPatientInfo({ patient }: PatientBannerPatientInfoProps) {
  const { excludePatientIdentifierCodeTypes } = useConfig();
  const { primaryIdentifierCode } = usePrimaryIdentifierCode();

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
            ? filteredIdentifiers.map(({ value, type }, index) => (
                <span key={value} className={styles.identifierTag}>
                  <div>{index > 0 && <span className={styles.separator}>&middot;</span>}</div>
                  {type?.coding?.[0]?.code === primaryIdentifierCode ? (
                    <div className={styles.primaryIdentifier}>
                      <Tag type="gray" title={type?.text}>
                        {type?.text}:
                      </Tag>
                      <span>{value}</span>
                    </div>
                  ) : (
                    <label htmlFor="identifier" className={styles.secondaryIdentifier}>
                      <span className={styles.label}>{type?.text}: </span>
                      <span id="identifier" className={styles.identifier}>
                        {value}
                      </span>
                    </label>
                  )}
                </span>
              ))
            : ''}
        </div>
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
