/** @module @category UI */
import React from 'react';
import classNames from 'classnames';
import { InlineLoading } from '@carbon/react';
import { type CoreTranslationKey, getCoreTranslation } from '@openmrs/esm-translations';
import { ConfigurableLink } from '@openmrs/esm-react-utils';
import { parseDate } from '@openmrs/esm-utils';
import { usePatientListsForPatient } from './usePatientListsForPatient';
import { useRelationships } from './useRelationships';
import styles from './patient-banner-contact-details.module.scss';

type FhirPatient = Omit<fhir.Patient, 'id'> & { id: string };

interface ContactDetailsProps {
  patient: FhirPatient;
  deceased: boolean;
}

interface CommonProps {
  patient: FhirPatient;
}

const Address: React.FC<CommonProps> = ({ patient }) => {
  const address = patient?.address?.find((a) => a.use === 'home');
  const getAddressKey = (url: string) => url.split('#')[1];

  return (
    <>
      <p className={styles.heading}>{getCoreTranslation('address', 'Address')}</p>
      <ul>
        {address ? (
          Object.entries(address)
            .filter(([key]) => key !== 'id' && key !== 'use')
            .map(([key, value]) =>
              key === 'extension' && Array.isArray(address.extension) ? (
                address.extension?.[0]?.extension?.map((add, i) => (
                  <li key={`address-${key}-${i}`}>
                    {getCoreTranslation(
                      getAddressKey(add.url) as CoreTranslationKey,
                      getAddressKey(add.url) as CoreTranslationKey,
                    )}
                    : {add.valueString}
                  </li>
                ))
              ) : (
                <li key={`address-${key}`}>
                  {getCoreTranslation(key as CoreTranslationKey, key)}: {value}
                </li>
              ),
            )
        ) : (
          <li>--</li>
        )}
      </ul>
    </>
  );
};

const Contact: React.FC<CommonProps> = ({ patient }) => {
  const contactDetails = getCoreTranslation('contactDetails', 'Contact Details');
  const telecom = patient?.telecom;

  return (
    <>
      <p className={styles.heading}>{contactDetails}</p>
      <ul>{telecom?.length ? telecom.map((contact) => <li key={contact.id}>{contact.value}</li>) : <li>--</li>}</ul>
    </>
  );
};

const PatientLists: React.FC<CommonProps> = ({ patient }) => {
  const { cohorts = [], isLoading } = usePatientListsForPatient(patient.id);

  return (
    <>
      <p className={styles.heading}>
        {getCoreTranslation('patientLists', 'Patient Lists')} ({cohorts?.length ?? 0})
      </p>
      {isLoading ? (
        <InlineLoading description={`${getCoreTranslation('loading', 'Loading')} ...`} role="progressbar" />
      ) : (
        <ul>
          {(() => {
            if (cohorts?.length > 0) {
              const sortedLists = cohorts.sort(
                (a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
              );
              const slicedLists = sortedLists.slice(0, 3);
              return slicedLists?.map((cohort) => (
                <li key={cohort.uuid}>
                  <ConfigurableLink to={`${window.spaBase}/home/patient-lists/${cohort.uuid}`} key={cohort.uuid}>
                    {cohort.name}
                  </ConfigurableLink>
                </li>
              ));
            }
            return <li>--</li>;
          })()}
          {cohorts.length > 3 && (
            <li className={styles.link}>
              <ConfigurableLink to={`${window.spaBase}/home/patient-lists`}>
                {getCoreTranslation('seeMoreLists', 'See {{count}} more lists', {
                  count: cohorts?.length - 3,
                })}
              </ConfigurableLink>
            </li>
          )}
        </ul>
      )}
    </>
  );
};

const Relationships: React.FC<CommonProps> = ({ patient }) => {
  const { data: relationships, isLoading } = useRelationships(patient.id);

  return (
    <>
      <p className={styles.heading}>{getCoreTranslation('relationships', 'Relationships')}</p>
      {isLoading ? (
        <InlineLoading description={`${getCoreTranslation('loading', 'Loading')} ...`} role="progressbar" />
      ) : (
        <ul>
          {relationships && relationships.length > 0 ? (
            <>
              {relationships.map((r) => (
                <li key={r.uuid} className={styles.relationship}>
                  <div>
                    <ConfigurableLink to={`${window.spaBase}/patient/${r.relativeUuid}/chart`}>
                      {r.display}
                    </ConfigurableLink>
                  </div>
                  <div>{r.relationshipType}</div>
                  <div>
                    {`${r.relativeAge ? r.relativeAge : '--'} ${
                      r.relativeAge ? (r.relativeAge === 1 ? 'yr' : 'yrs') : ''
                    }`}
                  </div>
                </li>
              ))}
            </>
          ) : (
            <li>--</li>
          )}
        </ul>
      )}
    </>
  );
};

export function PatientBannerContactDetails({ patient, deceased }: ContactDetailsProps) {
  return (
    <div className={classNames(deceased && styles.deceased, styles.contactDetails)}>
      <div className={styles.row}>
        <div className={styles.col}>
          <Address patient={patient} />
        </div>
        <div className={styles.col}>
          <Contact patient={patient} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.col}>
          <Relationships patient={patient} />
        </div>
        <div className={styles.col}>
          <PatientLists patient={patient} />
        </div>
      </div>
    </div>
  );
}
