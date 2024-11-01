/** @module @category UI */
import React from 'react';
import { Tag } from '@carbon/react';
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
    <div className={styles.primaryIdentifier}>
      {showIdentifierLabel && (
        <Tag className={styles.tag} type="gray" title={type?.text}>
          <span className={styles.label}>{type?.text}: </span>
          <span className={styles.value}>{value}</span>
        </Tag>
      )}
    </div>
  );
}

function SecondaryIdentifier({ showIdentifierLabel, type, value }: IdentifierProps) {
  return (
    <label htmlFor="identifier" className={styles.secondaryIdentifier}>
      {showIdentifierLabel && <span className={styles.label}>{type?.text}: </span>}
      <span id="identifier" className={styles.value}>
        {value}
      </span>
    </label>
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
    <div className={styles.identifiers}>
      {filteredIdentifiers?.length
        ? filteredIdentifiers.map(({ value, type }, index) => (
            <div key={value}>
              <div key={value} className={styles.identifierTag}>
                {index > 0 && <span className={styles.separator}>&middot;</span>}
                {type?.coding?.[0]?.code === primaryIdentifierCode ? (
                  <PrimaryIdentifier value={value} type={type} showIdentifierLabel={showIdentifierLabel} />
                ) : (
                  <SecondaryIdentifier value={value} type={type} showIdentifierLabel={showIdentifierLabel} />
                )}
              </div>
            </div>
          ))
        : ''}
    </div>
  );
}

export default PatientBannerPatientIdentifier;
