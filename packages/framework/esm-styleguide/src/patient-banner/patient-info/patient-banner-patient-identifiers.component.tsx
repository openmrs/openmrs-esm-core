/** @module @category UI */
import React from 'react';
import { FormLabel, Tag } from '@carbon/react';
import { useConfig, usePrimaryIdentifierCode } from '@openmrs/esm-react-utils';
import { type StyleguideConfigObject } from '../../config-schema';
import styles from './patient-banner-patient-info.module.scss';

interface IdentifierProps {
  showIdentifierLabel: boolean;
  type: fhir.CodeableConcept | undefined;
  value: string | undefined;
}

interface PatientBannerPatientIdentifierProps {
  identifier: fhir.Identifier[] | undefined;
  showIdentifierLabel: boolean;
}

function PrimaryIdentifier({ showIdentifierLabel, type, value }: IdentifierProps) {
  return (
    <span className={styles.primaryIdentifier}>
      {showIdentifierLabel && (
        <Tag className={styles.tag} type="gray" title={type?.text}>
          {type?.text && <span className={styles.label}>{type.text}: </span>}
          <span className={styles.value}>{value}</span>
        </Tag>
      )}
    </span>
  );
}

function SecondaryIdentifier({ showIdentifierLabel, type, value }: IdentifierProps) {
  return (
    <FormLabel className={styles.secondaryIdentifier} id={`patient-banner-identifier-${value}`}>
      {showIdentifierLabel && <span className={styles.label}>{type?.text}: </span>}
      <span className={styles.value}>{value}</span>
    </FormLabel>
  );
}

export function PatientBannerPatientIdentifier({
  identifier,
  showIdentifierLabel,
}: PatientBannerPatientIdentifierProps) {
  const { excludePatientIdentifierCodeTypes } = useConfig<StyleguideConfigObject>();
  const { primaryIdentifierCode } = usePrimaryIdentifierCode();

  const filteredIdentifiers =
    identifier?.filter((identifier) => {
      const code = identifier.type?.coding?.[0]?.code;
      return code && !excludePatientIdentifierCodeTypes?.uuids.includes(code);
    }) ?? [];

  return (
    <>
      {filteredIdentifiers?.length
        ? filteredIdentifiers.map(({ value, type }, index) => (
            <React.Fragment key={value}>
              <span className={styles.identifierTag}>
                {type?.coding?.[0]?.code === primaryIdentifierCode ? (
                  <PrimaryIdentifier value={value} type={type} showIdentifierLabel={showIdentifierLabel} />
                ) : (
                  <SecondaryIdentifier value={value} type={type} showIdentifierLabel={showIdentifierLabel} />
                )}
              </span>
              {index < filteredIdentifiers.length - 1 && <span className={styles.separator}>&middot;</span>}
            </React.Fragment>
          ))
        : ''}
    </>
  );
}

export default PatientBannerPatientIdentifier;
