/** @module @category UI */
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { ExtensionSlot } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { age, formatDate, parseDate } from '@openmrs/esm-utils';
import { FemaleIcon, MaleIcon, OtherIcon, UnknownIcon } from './gender-icons.component';
import PatientBannerPatientIdentifier from './patient-banner-patient-identifiers.component';
import styles from './patient-banner-patient-info.module.scss';

export interface PatientBannerPatientInfoProps {
  patient: fhir.Patient;
}

type Gender = 'female' | 'male' | 'other' | 'unknown';

interface GenderIconProps {
  gender: keyof typeof GENDER_ICONS;
}

const GENDER_ICONS = {
  Female: FemaleIcon,
  Male: MaleIcon,
  Other: OtherIcon,
  Unknown: UnknownIcon,
} as const;

const GenderIcon = ({ gender }: GenderIconProps) => {
  const IconComponent = GENDER_ICONS[gender];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent />;
};

const getGender = (gender: string): string => {
  const key = gender.toLowerCase() as Gender;
  return getCoreTranslation(key, gender);
};

export function PatientBannerPatientInfo({ patient }: PatientBannerPatientInfoProps) {
  const name = `${patient?.name?.[0]?.given?.join(' ')} ${patient?.name?.[0]?.family}`;
  const gender = patient?.gender && getGender(patient.gender);

  const extensionState = useMemo(() => ({ patientUuid: patient.id, patient }), [patient.id, patient]);

  return (
    <div className={styles.patientInfo}>
      <div className={classNames(styles.row, styles.patientNameRow)}>
        <div className={styles.flexRow}>
          <span className={styles.patientName}>{name}</span>

          {gender && (
            <div className={styles.gender}>
              <GenderIcon gender={gender as keyof typeof GENDER_ICONS} />
              <span>{gender}</span>
            </div>
          )}

          <ExtensionSlot className={styles.tagsSlot} name="patient-banner-tags-slot" state={extensionState} />
        </div>
      </div>
      <div className={styles.demographics}>
        {patient.birthDate && (
          <>
            <span>{age(patient.birthDate)}</span>
            <span>&middot;</span>
            <span>{formatDate(parseDate(patient.birthDate), { time: false })}</span>
            <span>&middot;</span>
          </>
        )}
        <PatientBannerPatientIdentifier identifier={patient.identifier} showIdentifierLabel={true} />
      </div>
    </div>
  );
}
