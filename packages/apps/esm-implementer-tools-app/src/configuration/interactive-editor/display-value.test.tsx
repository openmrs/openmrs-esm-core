import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { DisplayValue } from './display-value';
import { useOpenmrsSWR } from '@openmrs/esm-framework';

/**
 * Mocking the SWR hook from the OpenMRS framework to simulate various API responses
 * without making actual network requests during the unit tests.
 */
vi.mock('@openmrs/esm-framework', () => ({
  useOpenmrsSWR: vi.fn(),
}));

const mockUseOpenmrsSWR = vi.mocked(useOpenmrsSWR);

describe('DisplayValue Component - Concept UUID Resolution', () => {
  /**
   * Test Case 1: Standard clean UUID provided.
   * Expectation: The component should fetch and display the concept name alongside the UUID.
   */
  it('renders a concept name and UUID when a valid clean UUID is provided', () => {
    mockUseOpenmrsSWR.mockReturnValue({
      data: { data: { display: 'Malaria' } },
      isLoading: false,
      error: null,
    } as any);

    const testUuid = '8d49f56e-c2cc-11de-8d13-0010c6dffd0f';
    render(<DisplayValue value={testUuid} />);

    expect(screen.getByText('Malaria')).toBeInTheDocument();
    expect(screen.getByText(`(${testUuid})`)).toBeInTheDocument();
  });

  /**
   * Test Case 2: Stringified JSON format.
   * Expectation: The extraction logic should safely ignore quotes and correctly resolve the concept.
   */
  it('renders a concept name even when the UUID is wrapped in escaped quotes (Stringified JSON)', () => {
    mockUseOpenmrsSWR.mockReturnValue({
      data: { data: { display: 'Fever' } },
      isLoading: false,
      error: null,
    } as any);

    const cleanUuid = '8d49f56e-c2cc-11de-8d13-0010c6dffd0f';
    render(<DisplayValue value={`"${cleanUuid}"`} />);

    expect(screen.getByText('Fever')).toBeInTheDocument();
  });

  /**
   * Test Case 3: Nested Stringified Arrays (Legacy CIEL UUID format).
   * Expectation: The regex should extract the 36-char alphanumeric UUID from inside the brackets.
   */
  it('renders a concept name even when the UUID is inside a stringified JSON array with brackets', () => {
    mockUseOpenmrsSWR.mockReturnValue({
      data: { data: { display: 'Oxygen Saturation' } },
      isLoading: false,
      error: null,
    } as any);

    const cleanUuid = '161643AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    render(<DisplayValue value={`["${cleanUuid}"]`} />);

    expect(screen.getByText('Oxygen Saturation')).toBeInTheDocument();
  });

  /**
   * Test Case 4: Long text false-positive prevention.
   * Expectation: Because of the word boundary (\b) implementation, long configuration strings
   * should NOT be truncated and falsely interpreted as legacy UUIDs.
   */
  it('ignores strings that are just long text without word boundaries to prevent false positives', () => {
    const longString = 'someVeryLongRandomConfigurationValueThatExceeds36Characters';
    render(<DisplayValue value={longString} />);

    expect(screen.getByText(longString)).toBeInTheDocument();
  });

  /**
   * Test Case 5: Loading State (SWR backwards compatibility).
   * Expectation: It should render the fallback UUID while data and error are both undefined.
   */
  it('renders a loading state while fetching the concept name (SWR v1 fallback handling)', () => {
    mockUseOpenmrsSWR.mockReturnValue({
      data: undefined,
      error: undefined,
    } as any);

    const testUuid = '8d49f56e-c2cc-11de-8d13-0010c6dffd0f';
    render(<DisplayValue value={testUuid} />);

    expect(screen.getByText(testUuid)).toBeInTheDocument();
  });
});
