import dayjs from 'dayjs';
import type { i18n } from 'i18next';
import { age } from '.';

window.i18next = { language: 'en' } as i18n;

describe('Age Helper', () => {
  // test cases mostly taken from
  // https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
  // (Table 8)
  const now = dayjs('2024-07-30');
  const test1 = now.subtract(1, 'hour').subtract(30, 'minutes');
  const test2 = now.subtract(1, 'day').subtract(2, 'hours').subtract(5, 'minutes');
  const test3 = now.subtract(3, 'days').subtract(17, 'hours').subtract(30, 'minutes');
  const test4 = now.subtract(27, 'days').subtract(5, 'hours').subtract(2, 'minutes');
  const test5 = now.subtract(28, 'days').subtract(5, 'hours').subtract(2, 'minutes');
  const test6 = now.subtract(29, 'days').subtract(5, 'hours').subtract(2, 'minutes');
  const test7 = now.subtract(1, 'year').subtract(1, 'day').subtract(5, 'hours');
  const test8 = now.subtract(1, 'year').subtract(8, 'day').subtract(5, 'hours');
  const test9 = now.subtract(1, 'year').subtract(39, 'day').subtract(5, 'hours');
  const test10 = now.subtract(4, 'year').subtract(39, 'day');
  const test11 = now.subtract(18, 'year').subtract(39, 'day');

  it('should render durations correctly', () => {
    expect(age(test1, now)).toBe('90 min');
    expect(age(test2, now)).toBe('26 hr');
    expect(age(test3, now)).toBe('3 days');
    expect(age(test4, now)).toBe('27 days');
    expect(age(test5, now)).toBe('4 wks');
    expect(age(test6, now)).toBe('4 wks, 1 day');
    expect(age(test7, now)).toBe('12 mths, 1 day');
    expect(age(test8, now)).toBe('12 mths, 8 days');
    expect(age(test9, now)).toBe('13 mths, 9 days');
    expect(age(test10, now)).toBe('4 yrs, 1 mth');
    expect(age(test11, now)).toBe('18 yrs');
  });
});
