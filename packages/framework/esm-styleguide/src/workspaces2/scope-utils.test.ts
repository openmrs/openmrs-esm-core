import { describe, expect, it } from 'vitest';
import { shouldCloseOnUrlChange } from './scope-utils';

describe('shouldCloseOnUrlChange', () => {
  it.each([
    // Static patterns (no capture groups)
    [
      'stays open: both URLs match',
      '^/home/appointments',
      'http://localhost/home/appointments',
      'http://localhost/home/appointments',
      false,
    ],
    [
      'stays open: navigating within scope',
      '^/home/appointments',
      'http://localhost/home/appointments',
      'http://localhost/home/appointments/scheduled',
      false,
    ],
    [
      'closes: navigating away from scope',
      '^/home/appointments',
      'http://localhost/home/appointments',
      'http://localhost/home/service-queues',
      true,
    ],
    [
      'closes: old URL outside scope',
      '^/home/appointments',
      'http://localhost/home/service-queues',
      'http://localhost/home/appointments',
      true,
    ],
    [
      'closes: neither URL in scope',
      '^/home/appointments',
      'http://localhost/home/service-queues',
      'http://localhost/patient/123/chart',
      true,
    ],

    // Capture groups (patient chart)
    [
      'stays open: same patient, different tab',
      '^/patient/([^/]+)/chart',
      'http://localhost/patient/abc-123/chart/vitals',
      'http://localhost/patient/abc-123/chart/conditions',
      false,
    ],
    [
      'stays open: same patient chart URL',
      '^/patient/([^/]+)/chart',
      'http://localhost/patient/abc-123/chart',
      'http://localhost/patient/abc-123/chart',
      false,
    ],
    [
      'closes: different patient',
      '^/patient/([^/]+)/chart',
      'http://localhost/patient/abc-123/chart',
      'http://localhost/patient/def-456/chart',
      true,
    ],
    [
      'closes: leaving patient chart',
      '^/patient/([^/]+)/chart',
      'http://localhost/patient/abc-123/chart',
      'http://localhost/home/appointments',
      true,
    ],
    [
      'closes: entering patient chart',
      '^/patient/([^/]+)/chart',
      'http://localhost/home/appointments',
      'http://localhost/patient/abc-123/chart',
      true,
    ],

    // Multiple capture groups
    [
      'stays open: all captures match',
      '^/ward/([^/]+)/patient/([^/]+)',
      'http://localhost/ward/w1/patient/p1/details',
      'http://localhost/ward/w1/patient/p1/vitals',
      false,
    ],
    [
      'closes: first capture differs',
      '^/ward/([^/]+)/patient/([^/]+)',
      'http://localhost/ward/w1/patient/p1',
      'http://localhost/ward/w2/patient/p1',
      true,
    ],
    [
      'closes: second capture differs',
      '^/ward/([^/]+)/patient/([^/]+)',
      'http://localhost/ward/w1/patient/p1',
      'http://localhost/ward/w1/patient/p2',
      true,
    ],

    // Query params and hash are ignored
    [
      'stays open: query param change',
      '^/home/appointments',
      'http://localhost/home/appointments?tab=scheduled',
      'http://localhost/home/appointments?tab=completed',
      false,
    ],
    [
      'stays open: hash change',
      '^/home/appointments',
      'http://localhost/home/appointments#s1',
      'http://localhost/home/appointments#s2',
      false,
    ],

    // Edge cases
    ['closes: invalid regex (safety fallback)', '[invalid', 'http://localhost/home', 'http://localhost/home', true],
    [
      'stays open: relative URLs within scope',
      '^/home/appointments',
      '/home/appointments',
      '/home/appointments/details',
      false,
    ],
    ['closes: relative URLs leaving scope', '^/home/appointments', '/home/appointments', '/home/service-queues', true],
  ])('%s', (_desc, pattern, oldUrl, newUrl, expected) => {
    expect(shouldCloseOnUrlChange(pattern, oldUrl, newUrl)).toBe(expected);
  });
});
