import React, { useState } from 'react';
// @ts-ignore - vitest types are available at test runtime
import { vi } from 'vitest';
import { NEVER } from 'rxjs';
import type {} from '@openmrs/esm-globals';
import * as utils from '@openmrs/esm-utils';
import dayjs from 'dayjs';
// Import hooks that will be re-exported and used in mocks
import * as reactUtilsMock from '@openmrs/esm-react-utils/mock';

window.i18next = { ...window.i18next, language: 'en' };

export * from '@openmrs/esm-api/mock';
export * from '@openmrs/esm-emr-api/mock';
export * from '@openmrs/esm-config/mock';
export * from '@openmrs/esm-context';
export * from '@openmrs/esm-expression-evaluator/src/public';
export * from '@openmrs/esm-extensions/mock';
export * from '@openmrs/esm-react-utils/mock';
export * from '@openmrs/esm-state/mock';
export * from '@openmrs/esm-styleguide/mock';
export * from '@openmrs/esm-translations/mock';

export { parseDate, formatDate, formatDatetime, formatTime, formatPartialDate } from '@openmrs/esm-utils';

/* esm-globals */

export function setupPaths(config: any) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || 'production';
  window.spaVersion = process.env.BUILD_VERSION ?? 'local';
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
}

/* esm-dynamic-loading */
export const importDynamic = vi.fn();

/* esm-error-handling */

export const createErrorHandler = () => vi.fn().mockReturnValue(NEVER);

export const reportError = vi.fn().mockImplementation((error) => {
  throw error;
});

/* esm-feature-flags */
export const registerFeatureFlags = vi.fn();
export const getFeatureFlag = vi.fn().mockReturnValue(true);
export const subscribeToFeatureFlag = vi.fn((name: string, callback) => callback(true));

/* esm-navigation */
export { interpolateUrl, interpolateString } from '@openmrs/esm-navigation';
export const navigate = vi.fn();
export const getHistory = vi.fn(() => ['https://o3.openmrs.org/home']);
export const clearHistory = vi.fn();
export const goBackInHistory = vi.fn();

/* esm-offline */
export const useConnectivity = vi.fn().mockReturnValue(true);
export const subscribeConnectivity = vi.fn();

/* esm-styleguide */
export const showNotification = vi.fn();
export const showActionableNotification = vi.fn();
export const showToast = vi.fn();
export const showSnackbar = vi.fn();
export const showModal = vi.fn();

export const LeftNavMenu = vi.fn(() => <div>Left Nav Menu</div>);
export const setLeftNav = vi.fn();
export const unsetLeftNav = vi.fn();
export const ResponsiveWrapper = vi.fn(({ children }) => <>{children}</>);
export const ErrorState = vi.fn(() => <div>Error State</div>);

export const CustomOverflowMenu = vi.fn(({ menuTitle, children }) => (
  <div>
    <button>{menuTitle}</button>
    {children}
  </div>
));
export const PatientBannerActionsMenu = vi.fn(() => <div>Patient Banner Actions Menu</div>);

// Mock hooks used by PatientBannerContactDetails internal components
export const usePatient = vi.fn((patientId?: string) => ({
  patient: null as any,
  isLoading: false,
  error: null,
}));

export const usePatientContactAttributes = vi.fn((patientId?: string) => ({
  contactAttributes: [] as Array<any>,
  isLoading: false,
  error: null,
}));

export const useRelationships = vi.fn((patientId?: string) => ({
  data: [] as Array<any>,
  isLoading: false,
  error: null,
}));

export const usePatientListsForPatient = vi.fn((patientUuid?: string) => ({
  cohorts: [] as Array<any>,
  isLoading: false,
  error: null,
}));

export const PatientBannerContactDetails = vi.fn(({ patientId, deceased }) => {
  const { patient, isLoading: isLoadingPatient } = usePatient(patientId);
  const { contactAttributes, isLoading: isLoadingContact } = usePatientContactAttributes(patientId);
  const { data: relationships, isLoading: isLoadingRelationships } = useRelationships(patientId);
  const { cohorts, isLoading: isLoadingCohorts } = usePatientListsForPatient(patientId);

  return (
    <div data-testid="contact-details" data-deceased={deceased} data-patient-id={patientId}>
      <div>
        {/* Address Section */}
        <div data-testid="address-section">
          <p>Address</p>
          {isLoadingPatient ? (
            <div data-testid="loading-address">Loading...</div>
          ) : (
            <ul>
              {patient?.address?.[0] ? (
                Object.entries(patient.address[0])
                  .filter(([key]) => key !== 'id' && key !== 'use')
                  .map(([key, value]) => (
                    <li key={key} data-testid={`address-${key}`}>
                      {key}: {String(value)}
                    </li>
                  ))
              ) : (
                <li>--</li>
              )}
            </ul>
          )}
        </div>

        {/* Contact Details Section */}
        <div data-testid="contact-section">
          <p>Contact Details</p>
          {isLoadingContact ? (
            <div data-testid="loading-contact">Loading...</div>
          ) : (
            <ul>
              {contactAttributes?.length ? (
                contactAttributes.map((attr, idx) => (
                  <li key={idx} data-testid={`contact-${idx}`}>
                    {attr.attributeType?.display || 'Unknown'}: {attr.value}
                  </li>
                ))
              ) : (
                <li>--</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div>
        {/* Relationships Section */}
        <div data-testid="relationships-section">
          <p>Relationships</p>
          {isLoadingRelationships ? (
            <div data-testid="loading-relationships">Loading...</div>
          ) : (
            <ul>
              {relationships?.length ? (
                relationships.map((rel) => (
                  <li key={rel.uuid} data-testid={`relationship-${rel.uuid}`}>
                    <div>{rel.display}</div>
                    <div>{rel.relationshipType}</div>
                    <div>{rel.relativeAge ? `${rel.relativeAge} ${rel.relativeAge === 1 ? 'yr' : 'yrs'}` : '--'}</div>
                  </li>
                ))
              ) : (
                <li>--</li>
              )}
            </ul>
          )}
        </div>

        {/* Patient Lists Section */}
        <div data-testid="patient-lists-section">
          <p>Patient Lists ({cohorts?.length ?? 0})</p>
          {isLoadingCohorts ? (
            <div data-testid="loading-cohorts">Loading...</div>
          ) : (
            <ul>
              {cohorts?.length ? (
                <>
                  {cohorts.slice(0, 3).map((cohort) => (
                    <li key={cohort.uuid} data-testid={`cohort-${cohort.uuid}`}>
                      {cohort.name}
                    </li>
                  ))}
                  {cohorts.length > 3 && <li data-testid="more-cohorts">See {cohorts.length - 3} more lists</li>}
                </>
              ) : (
                <li>--</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
});

export const PatientBannerPatientInfo = vi.fn(({ patient, renderedFrom }) => {
  const name = utils.getPatientName(patient);
  const patientAge = patient?.birthDate ? utils.age(patient.birthDate) : null;
  const gender = patient?.gender;

  const genderInfo = gender
    ? {
        displayText: gender.charAt(0).toUpperCase() + gender.slice(1),
        iconKey: gender.charAt(0).toUpperCase() + gender.slice(1),
      }
    : null;

  const formattedBirthDate = patient?.birthDate
    ? utils.formatPartialDate
      ? utils.formatPartialDate(patient.birthDate, { time: false })
      : patient.birthDate
    : null;

  return (
    <div data-testid="patient-banner-info">
      <div>
        <span data-testid="patient-name">{name}</span>
        {genderInfo && (
          <div data-testid="patient-gender">
            <span data-testid="gender-icon">{genderInfo.iconKey}</span>
            <span>{genderInfo.displayText}</span>
          </div>
        )}
      </div>
      <div data-testid="patient-demographics">
        {patient?.birthDate && (
          <>
            {patientAge && (
              <>
                <span data-testid="patient-age">{patientAge}</span>
                <span>&middot;</span>
              </>
            )}
            <span data-testid="patient-birthdate">{formattedBirthDate}</span>
            <span>&middot;</span>
          </>
        )}
        <span data-testid="patient-identifiers">
          {patient?.identifier && (
            <PatientBannerPatientIdentifiers identifiers={patient.identifier} showIdentifierLabel={true} />
          )}
        </span>
      </div>
    </div>
  );
});

export const PatientBannerPatientIdentifiers = vi.fn(({ identifiers, showIdentifierLabel }) => {
  const config = reactUtilsMock.useConfig();
  const primaryIdentifierInfo = reactUtilsMock.usePrimaryIdentifierCode();

  const excludedUuids = config?.excludePatientIdentifierCodeTypes?.uuids || [];
  const primaryIdentifierCode = primaryIdentifierInfo?.primaryIdentifierCode || '05a29f94-c0ed-11e2-94be-8c13b969e334';

  const filteredIdentifiers =
    identifiers?.filter((identifier) => {
      const code = identifier.type?.coding?.[0]?.code;
      return code && !excludedUuids.includes(code);
    }) ?? [];

  return (
    <span data-testid="patient-identifiers">
      {filteredIdentifiers.map(({ value, type }, index) => {
        const code = type?.coding?.[0]?.code;
        const isPrimary = code === primaryIdentifierCode;

        return (
          <React.Fragment key={value}>
            <span
              data-testid={`identifier-${index}`}
              data-primary={isPrimary}
              data-identifier-type={isPrimary ? 'primary' : 'secondary'}
            >
              {showIdentifierLabel && type?.text && (
                <span data-testid={`identifier-label-${index}`}>{type.text}: </span>
              )}
              <span data-testid={`identifier-value-${index}`}>{value}</span>
            </span>
            {index < filteredIdentifiers.length - 1 && <span>&middot;</span>}
          </React.Fragment>
        );
      })}
    </span>
  );
});

export const PatientBannerToggleContactDetailsButton = vi.fn(() => (
  <div>Patient Banner Toggle Contact Details Button</div>
));

export const usePatientPhoto = vi.fn((patientUuid?: string) => ({
  isLoading: false,
  data: null as { imageSrc: string; dateTime: string } | null,
  error: null,
}));

export const PatientPhoto = vi.fn(({ patientUuid, patientName }) => {
  const { data: photo, isLoading } = usePatientPhoto(patientUuid);

  if (isLoading) {
    return <div data-testid="skeleton-icon">Loading...</div>;
  }

  return (
    <div data-testid="patient-photo" data-patient-uuid={patientUuid} data-patient-name={patientName}>
      {photo?.imageSrc ? (
        <img src={photo.imageSrc} alt={patientName} data-testid="patient-photo-img" />
      ) : (
        <div data-testid="patient-avatar-fallback">{patientName}</div>
      )}
    </div>
  );
});

export const ActionMenuButton = vi.fn(({ handler }) => <button onClick={handler}>Action Menu Button</button>);
export const ActionMenuButton2 = vi.fn(({ label, tagContent, icon }) => (
  <button>
    {icon} {tagContent} {label}
  </button>
));
export const ActionMenu = vi.fn(() => <div>Action Menu</div>);
export const WorkspaceContainer = vi.fn(() => <div>Workspace Container</div>);
export const closeWorkspace = vi.fn();
export const launchWorkspace = vi.fn();
export const launchWorkspace2 = vi.fn();
export const launchWorkspaceGroup = vi.fn();
export const navigateAndLaunchWorkspace = vi.fn();
export const useWorkspaces = vi.fn();

export const OpenmrsDatePicker = vi.fn(({ id, labelText, value, onChange, isInvalid, invalidText }) => (
  <>
    <label htmlFor={id}>{labelText}</label>
    <input
      id={id}
      type="text"
      value={value ? dayjs(value).format('DD/MM/YYYY') : ''}
      onChange={(evt) => onChange?.(dayjs(evt.target.value).toDate())}
    />
    {isInvalid && <span>{invalidText}</span>}
  </>
));

export const OpenmrsDateRangePicker = vi.fn(({ id, labelText, value = [], onChange, isInvalid, invalidText }) => {
  const [inputValue, setInputValue] = useState(() => {
    const [start, end] = value;
    const formattedStart = start ? dayjs(start).format('DD/MM/YYYY') : 'dd/mm/yyyy';
    const formattedEnd = end ? dayjs(end).format('DD/MM/YYYY') : 'dd/mm/yyyy';
    return `${formattedStart}–${formattedEnd}`;
  });

  const handleChange = (e) => {
    const raw = e.target.value;
    setInputValue(raw);

    const [startStr, endStr] = raw.split('–');
    const start = dayjs(startStr, 'DD/MM/YYYY', true);
    const end = dayjs(endStr, 'DD/MM/YYYY', true);

    if (start.isValid() && end.isValid()) {
      onChange?.([start.toDate(), end.toDate()]);
    }
  };

  return (
    <div>
      <label htmlFor={id}>{labelText}</label>
      <input id={id} type="text" value={inputValue} onChange={handleChange} />
      {isInvalid && <span>{invalidText}</span>}
    </div>
  );
});

export {
  getDefaultsFromConfigSchema,
  getPatientName,
  formatPatientName,
  selectPreferredName,
} from '@openmrs/esm-utils';

export const age = vi.fn((arg) => utils.age(arg));

export function isVersionSatisfied() {
  return true;
}
