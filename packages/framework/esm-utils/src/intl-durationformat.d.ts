// Ambient type declarations for Intl.DurationFormat (TC39 Stage 3 proposal).
// Can be removed once TypeScript ships built-in types for Intl.DurationFormat.
// Reference: https://tc39.es/proposal-intl-duration-format/

declare namespace Intl {
  interface ResolvedDurationFormatOptions {
    localeMatcher: 'best fit' | 'lookup';
    style: 'long' | 'short' | 'narrow' | 'digital';
    years: 'long' | 'short' | 'narrow';
    yearsDisplay: 'always' | 'auto';
    months: 'long' | 'short' | 'narrow';
    monthsDisplay: 'always' | 'auto';
    weeks: 'long' | 'short' | 'narrow';
    weeksDisplay: 'always' | 'auto';
    days: 'long' | 'short' | 'narrow';
    daysDisplay: 'always' | 'auto';
    hours: 'long' | 'short' | 'narrow' | 'numeric';
    hoursDisplay: 'always' | 'auto';
    minutes: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';
    minutesDisplay: 'always' | 'auto';
    seconds: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';
    secondsDisplay: 'always' | 'auto';
    milliseconds: 'long' | 'short' | 'narrow' | 'numeric';
    millisecondsDisplay: 'always' | 'auto';
    microseconds: 'long' | 'short' | 'narrow' | 'numeric';
    microsecondsDisplay: 'always' | 'auto';
    nanoseconds: 'long' | 'short' | 'narrow' | 'numeric';
    nanosecondsDisplay: 'always' | 'auto';
    fractionalDigits?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    numberingSystem: string;
  }

  type DurationFormatOptions = Partial<ResolvedDurationFormatOptions>;

  interface DurationInput {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
    microseconds?: number;
    nanoseconds?: number;
  }

  interface DurationFormatPart {
    unit?: string;
    type: string;
    value: string;
  }

  class DurationFormat {
    constructor(locales?: string | string[], options?: DurationFormatOptions);
    format(duration: DurationInput): string;
    formatToParts(duration: DurationInput): DurationFormatPart[];
    resolvedOptions(): ResolvedDurationFormatOptions;
    static supportedLocalesOf(
      locales: string | string[],
      options?: Pick<DurationFormatOptions, 'localeMatcher'>,
    ): string[];
  }
}
