/** @module @category UI */
import { Tag } from '@carbon/react';
import { useConfig, usePrimaryIdentifierCode } from '@openmrs/esm-react-utils';
import React from 'react';
import styles from './patient-banner-patient-info.module.scss';
import { type StyleguideConfigObject } from '../../config-schema';

interface PatientBannerPatientIdentifierProps {
  identifier: fhir.Identifier[] | undefined;
  showIdentifierLabel: boolean;
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
            <span key={value} className={styles.identifierTag}>
              <div>{index > 0 && <span className={styles.separator}>&middot;</span>}</div>
              {type?.coding?.[0]?.code === primaryIdentifierCode ? (
                <div className={styles.primaryIdentifier}>
                  {showIdentifierLabel && (
                    <Tag type="gray" title={type?.text}>
                      {type?.text}:
                    </Tag>
                  )}
                  <span>{value}</span>
                </div>
              ) : (
                <label htmlFor="identifier" className={styles.secondaryIdentifier}>
                  {showIdentifierLabel && <span className={styles.label}>{type?.text}: </span>}
                  <span id="identifier" className={styles.identifier}>
                    {value}
                  </span>
                </label>
              )}
            </span>
          ))
        : ''}
    </div>
  );
}

export default PatientBannerPatientIdentifier;
