import { describe, expect, it } from 'vitest';
import { normalizeInterpretation, calculateInterpretation, type ObsReferenceRanges } from './interpretation-utils';

describe('normalizeInterpretation', () => {
  it('returns undefined for undefined input', () => {
    expect(normalizeInterpretation(undefined)).toBeUndefined();
  });

  it('returns lowercase format as-is', () => {
    expect(normalizeInterpretation('critically_low')).toBe('critically_low');
    expect(normalizeInterpretation('critically_high')).toBe('critically_high');
    expect(normalizeInterpretation('high')).toBe('high');
    expect(normalizeInterpretation('low')).toBe('low');
    expect(normalizeInterpretation('normal')).toBe('normal');
    expect(normalizeInterpretation('off_scale_low')).toBe('off_scale_low');
    expect(normalizeInterpretation('off_scale_high')).toBe('off_scale_high');
  });

  it('returns uppercase format with lowercase format', () => {
    expect(normalizeInterpretation('CRITICALLY_LOW')).toBe('critically_low');
    expect(normalizeInterpretation('OFF_SCALE_LOW')).toBe('off_scale_low');
    expect(normalizeInterpretation('CRITICALLY_HIGH')).toBe('critically_high');
    expect(normalizeInterpretation('OFF_SCALE_HIGH')).toBe('off_scale_high');
    expect(normalizeInterpretation('HIGH')).toBe('high');
    expect(normalizeInterpretation('LOW')).toBe('low');
    expect(normalizeInterpretation('NORMAL')).toBe('normal');
  })

  it('converts -- to normal', () => {
    expect(normalizeInterpretation('--')).toBe('normal');
  });

  it('returns normal for unknown values', () => {
    expect(normalizeInterpretation('UNKNOWN' as any)).toBe('normal');
  });
});

describe('calculateInterpretation', () => {
  const fullRange: ObsReferenceRanges = {
    hiAbsolute: 200,
    hiCritical: 150,
    hiNormal: 100,
    lowNormal: 50,
    lowCritical: 30,
    lowAbsolute: 10,
  };

  it('returns normal when value is within normal range', () => {
    expect(calculateInterpretation(75, fullRange)).toBe('normal');
  });

  it('returns normal when range is not provided', () => {
    expect(calculateInterpretation(75)).toBe('normal');
  });

  it('returns normal when value is undefined', () => {
    expect(calculateInterpretation(undefined, fullRange)).toBe('normal');
  });

  it('returns normal when value is null', () => {
    expect(calculateInterpretation(null as any, fullRange)).toBe('normal');
  });

  it('returns normal when value is empty string', () => {
    expect(calculateInterpretation('', fullRange)).toBe('normal');
  });

  it('returns normal when value is not a number', () => {
    expect(calculateInterpretation('not a number', fullRange)).toBe('normal');
  });

  it('returns off_scale_high when value exceeds hiAbsolute', () => {
    expect(calculateInterpretation(250, fullRange)).toBe('off_scale_high');
  });

  it('returns critically_high when value exceeds hiCritical', () => {
    expect(calculateInterpretation(175, fullRange)).toBe('critically_high');
  });

  it('returns high when value exceeds hiNormal', () => {
    expect(calculateInterpretation(125, fullRange)).toBe('high');
  });

  it('returns off_scale_low when value is below lowAbsolute', () => {
    expect(calculateInterpretation(5, fullRange)).toBe('off_scale_low');
  });

  it('returns critically_low when value is below lowCritical', () => {
    expect(calculateInterpretation(20, fullRange)).toBe('critically_low');
  });

  it('returns low when value is below lowNormal', () => {
    expect(calculateInterpretation(40, fullRange)).toBe('low');
  });

  it('handles value exactly at hiCritical threshold', () => {
    expect(calculateInterpretation(150, fullRange)).toBe('critically_high');
  });

  it('handles value exactly at lowCritical threshold', () => {
    expect(calculateInterpretation(30, fullRange)).toBe('critically_low');
  });

  it('handles partial reference range (missing some thresholds)', () => {
    const partialRange: ObsReferenceRanges = {
      hiAbsolute: null,
      hiCritical: null,
      hiNormal: 100,
      lowNormal: 50,
      lowCritical: null,
      lowAbsolute: null,
    };
    expect(calculateInterpretation(125, partialRange)).toBe('high');
    expect(calculateInterpretation(40, partialRange)).toBe('low');
    expect(calculateInterpretation(75, partialRange)).toBe('normal');
  });

  it('handles string numeric values', () => {
    expect(calculateInterpretation('125', fullRange)).toBe('high');
    expect(calculateInterpretation('40', fullRange)).toBe('low');
  });

  it('handles decimal values', () => {
    expect(calculateInterpretation(125.5, fullRange)).toBe('high');
    expect(calculateInterpretation(40.2, fullRange)).toBe('low');
  });

  it('handles negative values', () => {
    const rangeWithNegatives: ObsReferenceRanges = {
      hiAbsolute: 100,
      hiCritical: 50,
      hiNormal: 0,
      lowNormal: -10,
      lowCritical: -20,
      lowAbsolute: -30,
    };
    expect(calculateInterpretation(-25, rangeWithNegatives)).toBe('critically_low');
    expect(calculateInterpretation(-5, rangeWithNegatives)).toBe('normal');
  });

  it('handles zero values', () => {
    const rangeWithZero: ObsReferenceRanges = {
      hiAbsolute: 100,
      hiCritical: 50,
      hiNormal: 10,
      lowNormal: 0,
      lowCritical: -10,
      lowAbsolute: -20,
    };
    expect(calculateInterpretation(0, rangeWithZero)).toBe('normal');
  });
});
