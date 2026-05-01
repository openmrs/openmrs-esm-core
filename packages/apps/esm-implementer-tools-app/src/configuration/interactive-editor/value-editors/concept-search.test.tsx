import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConceptSearchBox } from './concept-search';

vi.mock('@openmrs/esm-framework', () => ({
  // Pass debounced value through immediately so tests don't need fake timers
  useDebounce: <T,>(value: T) => value,
  getCoreTranslation: (key: string, fallback?: string) => {
    const translations: Record<string, string> = {
      error: 'Error',
      noResultsToDisplay: 'No results to display',
    };
    return translations[key] ?? fallback ?? key;
  },
}));

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
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('shows loading state while searching', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: true });
    renderConceptSearchBox();
    await user.type(screen.getByRole('searchbox'), 'aspirin');
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
    await user.type(screen.getByRole('searchbox'), 'aspirin');
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    // Raw error message should NOT be visible to the user
    expect(screen.queryByText(/500/)).not.toBeInTheDocument();
  });

  it('shows no results message when search returns empty', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: false });
    renderConceptSearchBox();
    await user.type(screen.getByRole('searchbox'), 'xyznotaconcept');
    expect(screen.getByText(/no results to display/i)).toBeInTheDocument();
  });

  it('renders concept results and calls setConcept on click', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({
      concepts: [{ uuid: 'abc-123', display: 'Aspirin', answers: [], mappings: [] }],
      error: undefined,
      isSearchingConcepts: false,
    });
    renderConceptSearchBox();
    await user.type(screen.getByRole('searchbox'), 'aspirin');
    const result = screen.getByText('Aspirin');
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
    await user.type(screen.getByRole('searchbox'), 'aspirin');
    const option = screen.getByText('Aspirin');
    option.focus();
    await user.keyboard('{Enter}');
    expect(noOpSetConcept).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'abc-123', display: 'Aspirin' }));
  });

  it('does not set aria-controls when no results are shown', () => {
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: false });
    renderConceptSearchBox();
    const input = screen.getByRole('searchbox');
    expect(input).not.toHaveAttribute('aria-controls');
  });

  it('does not show any UI state when query is whitespace only', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({ concepts: [], error: undefined, isSearchingConcepts: false });
    renderConceptSearchBox();
    await user.type(screen.getByRole('searchbox'), '   ');
    expect(screen.queryByText(/searching/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no results to display/i)).not.toBeInTheDocument();
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
    await user.type(screen.getByRole('searchbox'), 'aspirin');
    await user.click(screen.getByText('Aspirin'));
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('sets aria-controls when results list is rendered', async () => {
    const user = userEvent.setup();
    mockUseConceptLookup.mockReturnValue({
      concepts: [{ uuid: 'abc-123', display: 'Aspirin', answers: [], mappings: [] }],
      error: undefined,
      isSearchingConcepts: false,
    });
    renderConceptSearchBox();
    await user.type(screen.getByRole('searchbox'), 'aspirin');
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('aria-controls');
  });
});
