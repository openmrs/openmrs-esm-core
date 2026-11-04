/** @module @category UI */
import classNames from 'classnames';
import React from 'react';
import { FormLabel, Tag } from '@carbon/react';
import { useConfig, usePrimaryIdentifierCode } from '@openmrs/esm-react-utils';
import { type StyleguideConfigObject } from '../../config-schema';
import styles from './patient-banner-patient-info.module.scss';

interface IdentifiersProps {
  showIdentifierLabel: boolean;
  type: fhir.CodeableConcept | undefined;
  value: string | undefined;
}

interface PatientBannerPatientIdentifiersProps {
  identifiers: fhir.Identifier[] | undefined;
  showIdentifierLabel: boolean;
  showAllIdentifiers?: boolean;
}

function PrimaryIdentifier({ showIdentifierLabel, type, value }: IdentifiersProps) {
  return (
    <span className={styles.primaryIdentifier}>
      <Tag className={styles.tag} type="gray">
        {showIdentifierLabel && type?.text && <span className={styles.label}>{type.text}: </span>}
        <span className={styles.value}>{value}</span>
      </Tag>
    </span>
  );
}

function SecondaryIdentifier({ showIdentifierLabel, type, value }: IdentifiersProps) {
  return (
    <FormLabel className={styles.secondaryIdentifier} id={`patient-banner-identifier-${value}`}>
      {showIdentifierLabel && <span className={styles.label}>{type?.text}: </span>}
      <span className={styles.value}>{value}</span>
    </FormLabel>
  );
}

export function PatientBannerPatientIdentifiers({
  identifiers,
  showIdentifierLabel,
  showAllIdentifiers = true,
}: PatientBannerPatientIdentifiersProps) {
  const { excludePatientIdentifierCodeTypes } = useConfig<StyleguideConfigObject>();
  const { primaryIdentifierCode } = usePrimaryIdentifierCode();

  const filteredIdentifiers =
    identifiers?.filter((identifier) => {
      const code = identifier.type?.coding?.[0]?.code;
      return code && !excludePatientIdentifierCodeTypes?.uuids.includes(code);
    }) ?? [];

  const primaryIdentifiers = filteredIdentifiers.filter(
    (identifier) => identifier.type?.coding?.[0]?.code === primaryIdentifierCode,
  );

  let visibleIdentifiers = filteredIdentifiers;
  if (!showAllIdentifiers) {
    visibleIdentifiers = primaryIdentifiers.length > 0 ? primaryIdentifiers : filteredIdentifiers.slice(0, 1);
  }

  return (
    <>
      {visibleIdentifiers?.length
        ? visibleIdentifiers.map(({ value, type }, index) => (
            <span key={value} className={classNames(styles.identifier, styles.withSeparator)}>
              {type?.coding?.[0]?.code === primaryIdentifierCode ? (
                <PrimaryIdentifier showIdentifierLabel={showIdentifierLabel} type={type} value={value} />
              ) : (
                <SecondaryIdentifier showIdentifierLabel={showIdentifierLabel} type={type} value={value} />
              )}
            </span>
          ))
        : ''}
    </>
  );
}

export default PatientBannerPatientIdentifiers;
