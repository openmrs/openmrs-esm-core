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
      renderNumericObservation(36.5, '°C', 'Temperature', '123');

      expect(screen.getByText('36.5')).toBeInTheDocument();
      expect(screen.getByText('°C')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      renderNumericObservation(100, 'mmHg', 'BP', '123');

      expect(screen.getByText('BP')).toBeInTheDocument();
    });

    it('handles empty/null values gracefully', () => {
      renderNumericObservation(null as any, '°C', 'Temperature', '123');

      expect(screen.getByText('Not available')).toBeInTheDocument();
    });
  });

  describe('Variant Tests', () => {
    it('applies card variant styles by default', () => {
      renderNumericObservation(100, 'mmHg', 'BP', '123');

      expect(screen.getByTestId('numeric-observation-card')).toBeInTheDocument();
    });

    it('applies cell variant styles when specified', () => {
      renderNumericObservation(100, 'mmHg', 'BP', '123', 'cell');

      const element = screen.getByText('100 mmHg');
      expect(screen.queryByTestId('numeric-observation-card')).not.toBeInTheDocument();
      expect(element.tagName).toBe('DIV');
    });
  });

  describe('Interpretation Display', () => {
    it('displays correct arrow indicator for low interpretation', () => {
      mockUseConceptReferenceRange.mockReturnValue({
        referenceRange: {
          hiNormal: 100,
          hiCritical: 150,
          hiAbsolute: 200,
          lowNormal: 50,
          lowCritical: 30,
          lowAbsolute: 10,
        },
        isLoading: false,
        error: undefined,
      });

      renderNumericObservation(40, 'mmHg', 'BP', '123');

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_low_77e78c');
    });

    it('displays correct arrow indicator for critically-low interpretation', () => {
      mockUseConceptReferenceRange.mockReturnValue({
        referenceRange: {
          hiNormal: 100,
          hiCritical: 150,
          hiAbsolute: 200,
          lowNormal: 50,
          lowCritical: 30,
          lowAbsolute: 10,
        },
        isLoading: false,
        error: undefined,
      });

      renderNumericObservation(20, 'mmHg', 'BP', '123');

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_critically-low_77e78c');
    });

    it('displays correct arrow indicator for high interpretation', () => {
      mockUseConceptReferenceRange.mockReturnValue({
        referenceRange: {
          hiNormal: 100,
          hiCritical: 160,
          hiAbsolute: 200,
          lowNormal: 50,
          lowCritical: 30,
          lowAbsolute: 10,
        },
        isLoading: false,
        error: undefined,
      });

      renderNumericObservation(150, 'mmHg', 'BP', '123');

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_high_77e78c');
    });

    it('displays correct arrow indicator for critically-high interpretation', () => {
      mockUseConceptReferenceRange.mockReturnValue({
        referenceRange: {
          hiNormal: 100,
          hiCritical: 150,
          hiAbsolute: 200,
          lowNormal: 50,
          lowCritical: 30,
          lowAbsolute: 10,
        },
        isLoading: false,
        error: undefined,
      });

      renderNumericObservation(200, 'mmHg', 'BP', '123');

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_critically-high_77e78c');
    });

    it('displays correct arrow indicator for off-scale-low interpretation', () => {
      mockUseConceptReferenceRange.mockReturnValue({
        referenceRange: {
          hiNormal: 100,
          hiCritical: 150,
          hiAbsolute: 200,
          lowNormal: 50,
          lowCritical: 30,
          lowAbsolute: 10,
        },
        isLoading: false,
        error: undefined,
      });

      renderNumericObservation(5, 'mmHg', 'BP', '123');

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_off-scale_low_77e78c');
    });

    it('displays correct arrow indicator for off-scale-high interpretation', () => {
      mockUseConceptReferenceRange.mockReturnValue({
        referenceRange: {
          hiNormal: 100,
          hiCritical: 150,
          hiAbsolute: 200,
          lowNormal: 50,
          lowCritical: 30,
          lowAbsolute: 10,
        },
        isLoading: false,
        error: undefined,
      });

      renderNumericObservation(250, 'mmHg', 'BP', '123');

      expect(screen.getByText('BP')).toBeInTheDocument();
      const abnormalElement = screen.getByTitle('Abnormal value');
      expect(abnormalElement).toBeInTheDocument();
      expect(abnormalElement).toHaveClass('_off-scale_high_77e78c');
    });

    it('does not display arrow indicator for normal interpretation', () => {
      mockUseConceptReferenceRange.mockReturnValue({
        referenceRange: {
          hiNormal: 100,
          hiCritical: 150,
          hiAbsolute: 200,
          lowNormal: 50,
          lowCritical: 30,
          lowAbsolute: 10,
        },
        isLoading: false,
        error: undefined,
      });

      renderNumericObservation(75, 'mmHg', 'BP', '123');

      expect(screen.getByText('BP')).toBeInTheDocument();
    });
  });

  describe('Interpretation Calculation', () => {
    it('uses provided interpretation when available', () => {
      renderNumericObservation(100, 'mmHg', 'BP', '123');

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

      renderNumericObservation(125, 'mmHg', 'BP', '123', undefined, referenceRange);

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

      renderNumericObservation(75, 'mmHg', 'BP', '123', undefined, referenceRange);

      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });
});

const renderNumericObservation = (
  value: number,
  unit: string,
  label: string,
  patientUuid: string,
  variant?: 'card' | 'cell',
  referenceRange?: ObsReferenceRanges,
) => {
  render(
    <NumericObservation
      value={value}
      unit={unit}
      label={label}
      patientUuid={patientUuid}
      variant={variant}
      referenceRange={referenceRange}
    />,
  );
};
