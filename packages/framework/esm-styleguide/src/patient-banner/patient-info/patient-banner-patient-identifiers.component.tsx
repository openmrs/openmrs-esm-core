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
    <span className={styles.primaryIdentifier} data-testid="primary-patient-identifier">
      <Tag className={styles.tag} type="gray">
        {showIdentifierLabel && type?.text && <span className={styles.label}>{type.text}: </span>}
        <span className={styles.value}>{value}</span>
      </Tag>
    </span>
  );
}

function SecondaryIdentifier({ showIdentifierLabel, type, value }: IdentifiersProps) {
  return (
    <FormLabel
      className={styles.secondaryIdentifier}
      data-testid="secondary-patient-identifier"
      id={`patient-banner-identifier-${value}`}
    >
      {showIdentifierLabel && <span className={styles.label}>{type?.text}: </span>}
      <span className={styles.value}>{value}</span>
    </FormLabel>
  );
}

function isPreferredIdentifier(identifier: fhir.Identifier): boolean {
  return identifier.use?.toLowerCase() === 'official' || Boolean((identifier as any).preferred);
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

  const preferredIdentifiers = filteredIdentifiers.filter(isPreferredIdentifier);

  const highlightedIdentifier =
    preferredIdentifiers.length === 1
      ? preferredIdentifiers[0]
      : preferredIdentifiers.length > 1
        ? (preferredIdentifiers.find((id) => id.type?.coding?.[0]?.code === primaryIdentifierCode) ??
          preferredIdentifiers[0])
        : filteredIdentifiers.find((id) => id.type?.coding?.[0]?.code === primaryIdentifierCode);

  const displayIdentifiers = highlightedIdentifier
    ? [highlightedIdentifier, ...filteredIdentifiers.filter((id) => id !== highlightedIdentifier)]
    : filteredIdentifiers;

  return (
    <>
      {displayIdentifiers.length
        ? displayIdentifiers.map((identifier, index) => {
            const { value, type } = identifier;
            const isPrimary = identifier === highlightedIdentifier;

            return (
              <React.Fragment key={value ?? index}>
                <span className={styles.identifier}>
                  {isPrimary ? (
                    <PrimaryIdentifier showIdentifierLabel={showIdentifierLabel} type={type} value={value} />
                  ) : (
                    <SecondaryIdentifier showIdentifierLabel={showIdentifierLabel} type={type} value={value} />
                  )}
                </span>
                {index < displayIdentifiers.length - 1 && <span className={styles.separator}>&middot;</span>}
              </React.Fragment>
            );
          })
        : ''}
    </>
  );
}

export default PatientBannerPatientIdentifiers;
