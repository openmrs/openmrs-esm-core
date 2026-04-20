import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConceptSearchBox } from './concept-search';

vi.mock('./concept-search.resource', () => ({
  useConceptLookup: vi.fn(),
}));

import { useConceptLookup } from './concept-search.resource';

const mockUseConceptLookup = vi.mocked(useConceptLookup);

const noOpSetConcept = vi.fn();

function renderConceptSearchBox(value = '') {
  return render(<ConceptSearchBox setConcept={noOpSetConcept} value={value} />);
}

describe('ConceptSearchBox', () => {
  it('renders the search input', () => {
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: false });
    renderConceptSearchBox();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows loading state while searching', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: true });
    renderConceptSearchBox();
    await user.type(screen.getByRole('combobox'), 'aspirin');
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('shows generic error message (not raw error.message) on fetch failure', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({
      concepts: [],
      error: new Error('GET /openmrs/ws/rest/v1/concept?q=aspirin responded with 500'),
      isSearchingConcepts: false,
    });
    renderConceptSearchBox();
    await user.type(screen.getByRole('combobox'), 'aspirin');
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    // Raw error message should NOT be visible to the user
    expect(screen.queryByText(/500/)).not.toBeInTheDocument();
  });

  it('shows no results message when search returns empty', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: false });
    renderConceptSearchBox();
    await user.type(screen.getByRole('combobox'), 'xyznotaconcept');
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders concept results and calls setConcept on click', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({
      concepts: [{ uuid: 'abc-123', display: 'Aspirin', answers: [], mappings: [] }],
      error: undefined,
      isSearchingConcepts: false,
    });
    renderConceptSearchBox();
    await user.type(screen.getByRole('combobox'), 'aspirin');
    const result = screen.getByRole('option', { name: 'Aspirin' });
    expect(result).toBeInTheDocument();
    await user.click(result);
    expect(noOpSetConcept).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'abc-123', display: 'Aspirin' }));
  });

  it('selects a concept via keyboard Enter key', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({
      concepts: [{ uuid: 'abc-123', display: 'Aspirin', answers: [], mappings: [] }],
      error: undefined,
      isSearchingConcepts: false,
    });
    renderConceptSearchBox();
    await user.type(screen.getByRole('combobox'), 'aspirin');
    const option = screen.getByRole('option', { name: 'Aspirin' });
    option.focus();
    await user.keyboard('{Enter}');
    expect(noOpSetConcept).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'abc-123', display: 'Aspirin' }));
  });

  it('sets aria-expanded="false" and no aria-controls when no results are shown', () => {
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: false });
    renderConceptSearchBox();
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-controls');
  });

  it('does not show any UI state when query is whitespace only', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: false });
    renderConceptSearchBox();
    await user.type(screen.getByRole('combobox'), '   ');
    expect(screen.queryByText(/searching/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
    expect(mockUseConceptLookup).toHaveBeenCalledWith('');
  });

  it('clears the search input after a concept is selected', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({
      concepts: [{ uuid: 'abc-123', display: 'Aspirin', answers: [], mappings: [] }],
      error: undefined,
      isSearchingConcepts: false,
    });
    renderConceptSearchBox();
    await user.type(screen.getByRole('combobox'), 'aspirin');
    await user.click(screen.getByText('Aspirin'));
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('sets aria-controls and aria-expanded when results list is rendered', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({
      concepts: [{ uuid: 'abc-123', display: 'Aspirin', answers: [], mappings: [] }],
      error: undefined,
      isSearchingConcepts: false,
    });
    renderConceptSearchBox();
    await user.type(screen.getByRole('combobox'), 'aspirin');
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-controls');
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });
});
