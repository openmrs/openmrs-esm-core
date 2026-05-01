import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import type { i18n } from 'i18next';
import { age, ageAsDuration } from '.';

window.i18next = { language: 'en' } as i18n;

describe('Age Helper', () => {
  // test cases mostly taken from
  // https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
  // (Table 8)
  const now = dayjs('2024-07-30T08:30:55Z');

  it.each([
    {
      label: 'just born',
      birthDate: now,
      expectedOutput: '0 min',
    },
    {
      label: 'aged 1 hour 30 minutes',
      birthDate: now.subtract(1, 'hour').subtract(30, 'minutes'),
      expectedOutput: '90 min',
    },
    {
      label: 'aged 1 day 2 hours 5 minutes',
      birthDate: now.subtract(1, 'day').subtract(2, 'hours').subtract(5, 'minutes'),
      expectedOutput: '26 hr',
    },
    {
      label: 'aged 3 days 17 hours 7 minutes',
      birthDate: now.subtract(3, 'days').subtract(17, 'hours').subtract(30, 'minutes'),
      expectedOutput: '3 days',
    },
    {
      label: 'aged 27 days 5 hours 2 minutes',
      birthDate: now.subtract(27, 'days').subtract(5, 'hours').subtract(2, 'minutes'),
      expectedOutput: '27 days',
    },
    {
      label: 'aged 28 days 5 hours 2 minutes',
      birthDate: now.subtract(28, 'days').subtract(5, 'hours').subtract(2, 'minutes'),
      expectedOutput: '4 wks',
    },
    {
      label: 'aged 29 days 5 hours 2 minutes',
      birthDate: now.subtract(29, 'days').subtract(5, 'hours').subtract(2, 'minutes'),
      expectedOutput: '4 wks, 1 day',
    },
    {
      label: 'aged 1 year 1 day 5 hours',
      birthDate: now.subtract(1, 'year').subtract(1, 'day').subtract(5, 'hours'),
      expectedOutput: '12 mths, 1 day',
    },
    {
      label: 'aged 1 year 8 days 5 hours',
      birthDate: now.subtract(1, 'year').subtract(8, 'days').subtract(5, 'hours'),
      expectedOutput: '12 mths, 8 days',
    },
    {
      label: 'aged 1 year 38 days 5 hours',
      birthDate: now.subtract(1, 'year').subtract(38, 'days').subtract(5, 'hours'),
      expectedOutput: '13 mths, 8 days',
    },
    {
      label: 'aged 4 years 38 days',
      birthDate: now.subtract(4, 'years').subtract(38, 'days').subtract(5, 'hours'),
      expectedOutput: '4 yrs, 1 mth',
    },
    {
      label: 'aged 18 years 38 days',
      birthDate: now.subtract(18, 'years').subtract(38, 'days'),
      expectedOutput: '18 yrs',
    },
    {
      label: 'born in 2000',
      birthDate: '2000',
      expectedOutput: '24 yrs',
    },
    {
      label: 'born 10 years, 10 months ago estimated',
      birthDate: '2014',
      expectedOutput: '10 yrs',
    },
    {
      label: 'born in June 2020',
      birthDate: '2020-06',
      expectedOutput: '4 yrs, 1 mth',
    },
    {
      label: 'born Feb 29th 2020',
      birthDate: '2020-02-29',
      expectedOutput: '4 yrs, 5 mths',
    },
    {
      label: 'born January 1st 2020',
      birthDate: '2020-01-01',
      expectedOutput: '4 yrs, 6 mths',
    },
  ])("should produce '$expectedOutput' for person $label", ({ birthDate, expectedOutput }) => {
    expect(age(birthDate, now)).toBe(expectedOutput);
  });
});

describe('ageAsDuration', () => {
  const now = dayjs('2024-07-30T08:30:55Z');

  it('returns null for null birthDate', () => {
    expect(ageAsDuration(null)).toBeNull();
  });

  it.each([
    {
      label: 'just born',
      birthDate: now,
      expected: { minutes: 0 },
    },
    {
      label: 'aged 1 hour 30 minutes',
      birthDate: now.subtract(1, 'hour').subtract(30, 'minutes'),
      expected: { minutes: 90 },
    },
    {
      label: 'aged 1 day 2 hours 5 minutes',
      birthDate: now.subtract(1, 'day').subtract(2, 'hours').subtract(5, 'minutes'),
      expected: { hours: 26 },
    },
    {
      label: 'aged 3 days 17 hours 30 minutes',
      birthDate: now.subtract(3, 'days').subtract(17, 'hours').subtract(30, 'minutes'),
      expected: { days: 3 },
    },
    {
      label: 'aged 29 days 5 hours 2 minutes',
      birthDate: now.subtract(29, 'days').subtract(5, 'hours').subtract(2, 'minutes'),
      expected: { weeks: 4, days: 1 },
    },
    {
      label: 'aged 1 year 8 days 5 hours',
      birthDate: now.subtract(1, 'year').subtract(8, 'days').subtract(5, 'hours'),
      expected: { months: 12, days: 8 },
    },
    {
      label: 'aged 4 years 38 days',
      birthDate: now.subtract(4, 'years').subtract(38, 'days').subtract(5, 'hours'),
      expected: { years: 4, months: 1 },
    },
    {
      label: 'aged 18 years 38 days',
      birthDate: now.subtract(18, 'years').subtract(38, 'days'),
      expected: { years: 18 },
    },
    {
      label: 'born in 2000 (string)',
      birthDate: '2000',
      expected: { years: 24 },
    },
    {
      label: 'born in June 2020 (string)',
      birthDate: '2020-06',
      expected: { years: 4, months: 1 },
    },
    {
      label: 'born Feb 29th 2020 (string)',
      birthDate: '2020-02-29',
      expected: { years: 4, months: 5 },
    },
    {
      label: 'born January 1st 2020 (string)',
      birthDate: '2020-01-01',
      expected: { years: 4, months: 6 },
    },
  ])('returns $expected for person $label', ({ birthDate, expected }) => {
    expect(ageAsDuration(birthDate, now)).toEqual(expected);
  });

  it('returns null for an invalid string', () => {
    expect(ageAsDuration('not a date', now)).toBeNull();
  });
});
