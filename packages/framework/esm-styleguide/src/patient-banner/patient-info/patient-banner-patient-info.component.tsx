/** @module @category UI */
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { ExtensionSlot } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { age, formatPartialDate, getPatientName } from '@openmrs/esm-utils';
import { GenderFemaleIcon, GenderMaleIcon, GenderOtherIcon, GenderUnknownIcon } from '../../icons';
import PatientBannerPatientIdentifiers from './patient-banner-patient-identifiers.component';
import styles from './patient-banner-patient-info.module.scss';

interface PatientBannerPatientInfoProps {
  patient: fhir.Patient;

  /**
   * A unique string to identify where the PatientInfo is rendered from.
   * (ex: Patient Chart, search app, etc...). This string is passed into extensions to
   * affect how / if they should be rendered
   */
  renderedFrom?: string;
}

type Gender = 'female' | 'male' | 'other' | 'unknown';

interface GenderIconProps {
  gender: keyof typeof GENDER_ICONS;
}

const GENDER_ICONS = {
  Female: GenderFemaleIcon,
  Male: GenderMaleIcon,
  Other: GenderOtherIcon,
  Unknown: GenderUnknownIcon,
} as const;

const GenderIcon = ({ gender }: GenderIconProps) => {
  const IconComponent = GENDER_ICONS[gender];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent fill="#525252" />;
};

const GENDER_MAP = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  unknown: 'Unknown',
} as const;

const getGender = (gender: string) => {
  const normalizedGender = gender.toLowerCase() as Gender;
  const iconKey = GENDER_MAP[normalizedGender] ?? 'Unknown';
  return {
    displayText: getCoreTranslation(normalizedGender, gender),
    iconKey,
  };
};

export function PatientBannerPatientInfo({ patient, renderedFrom }: PatientBannerPatientInfoProps) {
  const name = getPatientName(patient);
  const genderInfo = patient?.gender && getGender(patient.gender);

  const extensionState = useMemo(
    () => ({ patientUuid: patient.id, patient, renderedFrom }),
    [patient.id, patient, renderedFrom],
  );

  return (
    <div className={styles.patientInfo}>
      <div className={classNames(styles.row, styles.patientNameRow)}>
        <div className={styles.flexRow}>
          <span className={styles.patientName}>{name}</span>

          {genderInfo && (
            <div className={styles.gender}>
              <GenderIcon gender={genderInfo.iconKey} />
              <span>{genderInfo.displayText}</span>
            </div>
          )}

          <ExtensionSlot className={styles.tagsSlot} name="patient-banner-tags-slot" state={extensionState} />
        </div>
      </div>
      <div className={styles.demographics}>
        {patient.birthDate && (
          <>
            <span>{age(patient.birthDate)}</span>
            <span className={styles.separator}>&middot;</span>
            <span>{formatPartialDate(patient.birthDate, { time: false })}</span>
            <span className={styles.separator}>&middot;</span>
          </>
        )}
        <PatientBannerPatientIdentifiers identifiers={patient.identifier} showIdentifierLabel />
        <ExtensionSlot className={styles.extensionSlot} name="patient-banner-bottom-slot" state={extensionState} />
      </div>
    </div>
  );
}
