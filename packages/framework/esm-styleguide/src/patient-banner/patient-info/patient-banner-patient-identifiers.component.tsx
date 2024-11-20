/** @module @category UI */
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
}: PatientBannerPatientIdentifiersProps) {
  const { excludePatientIdentifierCodeTypes } = useConfig<StyleguideConfigObject>();
  const { primaryIdentifierCode } = usePrimaryIdentifierCode();

  const filteredIdentifiers =
    identifiers?.filter((identifier) => {
      const code = identifier.type?.coding?.[0]?.code;
      return code && !excludePatientIdentifierCodeTypes?.uuids.includes(code);
    }) ?? [];

  return (
    <>
      {filteredIdentifiers?.length
        ? filteredIdentifiers.map(({ value, type }, index) => (
            <React.Fragment key={value}>
              <span className={styles.identifier}>
                {type?.coding?.[0]?.code === primaryIdentifierCode ? (
                  <PrimaryIdentifier showIdentifierLabel={showIdentifierLabel} type={type} value={value} />
                ) : (
                  <SecondaryIdentifier showIdentifierLabel={showIdentifierLabel} type={type} value={value} />
                )}
              </span>
              {index < filteredIdentifiers.length - 1 && <span className={styles.separator}>&middot;</span>}
            </React.Fragment>
          ))
        : ''}
    </>
  );
}

export default PatientBannerPatientIdentifiers;
