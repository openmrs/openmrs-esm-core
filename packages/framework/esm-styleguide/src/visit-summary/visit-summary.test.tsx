import React from 'react';
import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useConfig } from '@openmrs/esm-react-utils';
import { type Visit } from '@openmrs/esm-emr-api';
import VisitSummary from './visit-summary.component';

// esm-utils date helpers read window.i18next.language (see datepicker.test.tsx).
window.i18next = { language: 'en' } as i18n;

// Timeline tab fetches encounters of its own; keep it deterministic.
vi.mock('./useEncountersByVisit', () => ({
  useEncountersByVisit: () => ({ encounters: [], isLoading: false, error: undefined }),
}));

const mockUseConfig = vi.mocked(useConfig);

const drugOrderTypeUUID = 'drug-order-type-uuid';
const notesConceptUuids = ['note-concept-uuid'];

const visitWithData = {
  uuid: 'visit-uuid',
  encounters: [
    {
      uuid: 'enc-1',
      encounterDatetime: '2026-06-22T13:07:00.000+0000',
      encounterProviders: [
        { provider: { person: { display: 'Dr James Cook' } }, encounterRole: { display: 'Clinician' } },
      ],
      diagnoses: [{ uuid: 'dx-1', display: 'Malaria', rank: 1, voided: false }],
      obs: [{ uuid: 'obs-1', concept: { uuid: 'note-concept-uuid', display: 'Note' }, value: 'Patient seems unwell' }],
      orders: [],
    },
  ],
} as unknown as Visit;

const emptyVisit = { uuid: 'visit-empty', encounters: [] } as unknown as Visit;

const renderSummary = (visit: Visit) =>
  render(
    <VisitSummary
      visit={visit}
      patientUuid="patient-uuid"
      notesConceptUuids={notesConceptUuids}
      drugOrderTypeUUID={drugOrderTypeUUID}
    />,
  );

describe('VisitSummary', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue({ diagnosisTags: { primaryColor: 'blue', secondaryColor: 'green' } });
  });

  it('renders the diagnoses section and the visit summary tabs', () => {
    renderSummary(visitWithData);

    expect(screen.getByText('Diagnoses')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tests/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /medications/i })).toBeInTheDocument();
  });

  it('renders diagnosis tags parsed from the visit encounters', () => {
    renderSummary(visitWithData);
    expect(screen.getByText('Malaria')).toBeInTheDocument();
  });

  it('shows the empty diagnoses message when the visit has no diagnoses', () => {
    renderSummary(emptyVisit);
    expect(screen.getByText('No diagnoses found')).toBeInTheDocument();
  });
});
