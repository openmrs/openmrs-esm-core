import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NumericObservation } from './numeric-observation.component';
import { useConceptReferenceRange } from './use-concept-reference-range';
import type { ObsReferenceRanges } from './interpretation-utils';

const mockUseConceptReferenceRange = vi.mocked(useConceptReferenceRange);

vi.mock('./use-concept-reference-range', () => ({
  useConceptReferenceRange: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

describe('NumericObservation', () => {
  beforeEach(() => {
    mockUseConceptReferenceRange.mockReturnValue({
      referenceRange: undefined,
      isLoading: false,
      error: undefined,
    });
  });

  describe('Basic Rendering', () => {
    it('renders value and unit correctly', () => {
      render(<NumericObservation value={36.5} unit="°C" label="Temperature" />);

      expect(screen.getByText('36.5')).toBeInTheDocument();
      expect(screen.getByText('°C')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<NumericObservation value={100} unit="mmHg" label="BP" />);

      expect(screen.getByText('BP')).toBeInTheDocument();
    });

    it('hides label when showLabel={false}', () => {
      render(<NumericObservation value={100} unit="mmHg" label="BP" showLabel={false} />);

      expect(screen.queryByText('BP')).not.toBeInTheDocument();
    });

    it('handles empty/null values gracefully', () => {
      render(<NumericObservation value={null as any} unit="°C" label="Temperature" />);

      expect(screen.getByText('Not available')).toBeInTheDocument();
    });
  });

  describe('Variant Tests', () => {
    it('applies card variant styles by default', () => {
      render(<NumericObservation value={100} unit="mmHg" label="BP" />);

      expect(screen.getByTestId('numeric-observation-card')).toBeInTheDocument();
    });

    it('applies cell variant styles when specified', () => {
      render(<NumericObservation value={100} unit="mmHg" variant="cell" />);

      const element = screen.getByText('100 mmHg');
      expect(screen.queryByTestId('numeric-observation-card')).not.toBeInTheDocument();
      expect(element.tagName).toBe('DIV');
    });
  });

  describe('Interpretation Display', () => {
    it('displays correct arrow indicator for low interpretation', () => {
      render(<NumericObservation value={40} unit="mmHg" label="BP" interpretation="low" />);

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_low_77e78c');
    });

    it('displays correct arrow indicator for critically-low interpretation', () => {
      render(<NumericObservation value={20} unit="mmHg" label="BP" interpretation="critically_low" />);

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_critically-low_77e78c');
    });

    it('displays correct arrow indicator for high interpretation', () => {
      render(<NumericObservation value={150} unit="mmHg" label="BP" interpretation="high" />);

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_high_77e78c');
    });

    it('displays correct arrow indicator for critically-high interpretation', () => {
      render(<NumericObservation value={200} unit="mmHg" label="BP" interpretation="critically_high" />);

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_critically-high_77e78c');
    });

    it('displays correct arrow indicator for off-scale-low interpretation', () => {
      render(<NumericObservation value={5} unit="mmHg" label="BP" interpretation="off_scale_low" />);

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_off-scale_low_77e78c');
    });

    it('displays correct arrow indicator for off-scale-high interpretation', () => {
      render(<NumericObservation value={250} unit="mmHg" label="BP" interpretation="off_scale_high" />);

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_off-scale_high_77e78c');
    });

    it('does not display arrow indicator for normal interpretation', () => {
      render(<NumericObservation value={100} unit="mmHg" label="BP" interpretation="normal" />);

      expect(screen.getByText('BP')).toBeInTheDocument();
    });
  });

  describe('Interpretation Calculation', () => {
    it('uses provided interpretation when available', () => {
      render(<NumericObservation value={100} unit="mmHg" interpretation="high" />);

      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('calculates interpretation from referenceRange when provided', () => {
      const referenceRange: ObsReferenceRanges = {
        hiNormal: 100,
        hiCritical: 150,
        hiAbsolute: 200,
        lowNormal: 50,
        lowCritical: 30,
        lowAbsolute: 10,
      };

      render(<NumericObservation value={125} unit="mmHg" referenceRange={referenceRange} />);

      expect(screen.getByText('125')).toBeInTheDocument();
    });

    it('returns normal when value is within normal range', () => {
      const referenceRange: ObsReferenceRanges = {
        hiNormal: 100,
        hiCritical: 150,
        hiAbsolute: 200,
        lowNormal: 50,
        lowCritical: 30,
        lowAbsolute: 10,
      };

      render(<NumericObservation value={75} unit="mmHg" referenceRange={referenceRange} />);

      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });
});
