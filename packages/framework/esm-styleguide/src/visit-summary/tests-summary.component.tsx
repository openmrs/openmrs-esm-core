import React from 'react';
import { ExtensionSlot } from '@openmrs/esm-react-utils';
import { type Encounter } from '@openmrs/esm-emr-api';

type FilteredResultsFilter = (data: [{ encounter?: { reference?: string } }]) => boolean;

const TestsSummary = ({ patientUuid, encounters = [] }: { patientUuid: string; encounters: Array<Encounter> }) => {
  const filter = React.useMemo<FilteredResultsFilter>(() => {
    const encounterIds = new Set(encounters.map((e) => `Encounter/${e.uuid}`));
    return ([entry]) => {
      return encounterIds.has(entry.encounter?.reference ?? '');
    };
  }, [encounters]);

  return <ExtensionSlot name="test-results-filtered-overview-slot" state={{ filter, patientUuid }} />;
};

export default TestsSummary;
