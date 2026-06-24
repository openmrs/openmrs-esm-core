import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { Extension, ExtensionSlot, useAssignedExtensions } from '@openmrs/esm-react-utils';
import { formatTime, parseDate } from '@openmrs/esm-utils';
import { type Diagnosis, type Visit } from '@openmrs/esm-emr-api';
import { DiagnosisTags } from '../diagnosis-tags/diagnosis-tags.component';
import type { Note, Order, OrderItem } from './types';
import MedicationSummary from './medications-summary.component';
import NotesSummary from './notes-summary.component';
import TestsSummary from './tests-summary.component';
import VisitTimeline from './visit-timeline.component';
import styles from './visit-summary.module.scss';

interface VisitSummaryProps {
  visit: Visit;
  patientUuid: string;
  /** Concept UUIDs whose observations are rendered as visit notes. */
  notesConceptUuids?: Array<string>;
  /** Order type UUID used to filter drug orders in the medications tab. */
  drugOrderTypeUUID: string;
  /** When true, tabs with no data are disabled. */
  disableEmptyTabs?: boolean;
}

const visitSummaryPanelSlot = 'visit-summary-panels';
const visitSummaryCompletedFormsSlot = 'visit-summary-completed-forms-slot';

const VisitSummary: React.FC<VisitSummaryProps> = ({
  visit,
  patientUuid,
  notesConceptUuids = [],
  drugOrderTypeUUID,
  disableEmptyTabs,
}) => {
  const { t } = useTranslation();
  const extensions = useAssignedExtensions(visitSummaryPanelSlot);
  const completedFormsExtensions = useAssignedExtensions(visitSummaryCompletedFormsSlot);

  const [diagnoses, notes, medications]: [Array<Diagnosis>, Array<Note>, Array<OrderItem>] = useMemo(() => {
    // Medication Tab
    const medications: Array<OrderItem> = [];
    // Diagnoses in a Visit
    const diagnoses: Array<Diagnosis> = [];
    // Notes Tab
    const notes: Array<Note> = [];

    visit?.encounters?.forEach((enc) => {
      const provider = {
        name: enc.encounterProviders?.[0]?.provider?.person?.display ?? '',
        role: enc.encounterProviders?.[0]?.encounterRole?.display ?? '',
      };

      enc.orders?.forEach((order: Order) => {
        medications.push({ order, provider });
      });

      // Check if there is a diagnosis associated with this encounter
      const validDiagnoses = enc.diagnoses?.filter((diagnosis) => !diagnosis.voided) ?? [];
      diagnoses.push(...validDiagnoses);

      // Check for Visit Diagnoses and Notes
      enc.obs?.forEach((obs) => {
        if (obs.concept && notesConceptUuids?.includes(obs.concept.uuid)) {
          // Putting all notes in a single array.
          notes.push({
            id: obs.uuid, // obs values are typed as unknown; visit notes are free-text string observations.
            note: obs.value as string,
            provider,
            time: enc.encounterDatetime ? formatTime(parseDate(enc.encounterDatetime)) : '',
            concept: obs.concept,
          });
        }
      });
    });

    // Sort the diagnoses by rank, so that primary diagnoses come first
    diagnoses.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

    // Sort medications by dateActivated DESC (newest first) to align with backend ordering
    medications.sort((a, b) => new Date(b.order.dateActivated).getTime() - new Date(a.order.dateActivated).getTime());

    return [diagnoses, notes, medications];
  }, [notesConceptUuids, visit?.encounters]);

  const encounterIds = useMemo(() => visit?.encounters?.map((e) => `Encounter/${e.uuid}`) ?? [], [visit?.encounters]);

  return (
    <div className={styles.summaryContainer}>
      <p className={styles.diagnosisLabel}>{t('diagnoses', 'Diagnoses')}</p>
      <div className={styles.diagnosesList}>
        {diagnoses.length > 0 ? (
          <DiagnosisTags diagnoses={diagnoses} />
        ) : (
          <p className={classNames(styles.bodyLong01, styles.text02)} style={{ marginBottom: '0.5rem' }}>
            {t('noDiagnosesFound', 'No diagnoses found')}
          </p>
        )}
      </div>
      <Tabs>
        <TabList aria-label="Visit summary tabs" className={styles.tablist}>
          <Tab className={classNames(styles.tab, styles.bodyLong01)} id="timeline-tab">
            {t('timeline', 'Timeline')}
          </Tab>
          <Tab
            className={classNames(styles.tab, styles.bodyLong01)}
            id="notes-tab"
            disabled={notes.length <= 0 && disableEmptyTabs}
          >
            {t('notes', 'Notes')}
          </Tab>
          <Tab className={styles.tab} id="tests-tab" disabled={encounterIds.length === 0 && disableEmptyTabs}>
            {t('tests', 'Tests')}
          </Tab>
          <Tab className={styles.tab} id="medications-tab" disabled={medications.length <= 0 && disableEmptyTabs}>
            {t('medications', 'Medications')}
          </Tab>
          {completedFormsExtensions?.map((extension, index) => (
            <Tab key={extension.id} className={styles.tab} id={`${extension.meta.title || index}-completed-forms-tab`}>
              {t(extension.meta.title, {
                ns: extension.moduleName,
                defaultValue: extension.meta.title,
              })}
            </Tab>
          ))}
          {extensions?.map((extension, index) => (
            <Tab key={extension.id} className={styles.tab} id={`${extension.meta.title || index}-tab`}>
              {t(extension.meta.title, {
                ns: extension.moduleName,
                defaultValue: extension.meta.title,
              })}
            </Tab>
          ))}
        </TabList>
        {/* Wrap TabPanels so it is a single grid item: Carbon's TabPanels renders a Fragment, which would
            otherwise place every TabPanel as a direct child of the summaryContainer grid and break the layout. */}
        <div className={styles.tabPanels}>
          <TabPanels>
            <TabPanel>
              <VisitTimeline visitUuid={visit.uuid} patientUuid={patientUuid} />
            </TabPanel>
            <TabPanel>
              <NotesSummary notes={notes} />
            </TabPanel>
            <TabPanel>
              <TestsSummary patientUuid={patientUuid} encounters={visit?.encounters ?? []} />
            </TabPanel>
            <TabPanel>
              <MedicationSummary medications={medications} drugOrderTypeUUID={drugOrderTypeUUID} />
            </TabPanel>
            <ExtensionSlot name={visitSummaryCompletedFormsSlot}>
              <TabPanel>
                <Extension state={{ patientUuid, visit }} />
              </TabPanel>
            </ExtensionSlot>
            <ExtensionSlot name={visitSummaryPanelSlot}>
              <TabPanel>
                <Extension state={{ patientUuid, visit }} />
              </TabPanel>
            </ExtensionSlot>
          </TabPanels>
        </div>
      </Tabs>
    </div>
  );
};

export default VisitSummary;
