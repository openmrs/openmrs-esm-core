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
    withSpaBase('/', () => {
      expect(shouldCloseOnUrlChange(pattern, oldUrl, newUrl)).toBe(expected);
    });
  });

  it.each([
    [
      'stays open: navigation from the exact SPA base remains in a root scope',
      '^/',
      'http://localhost/openmrs/spa',
      'http://localhost/openmrs/spa/home',
      false,
    ],
    [
      'stays open: same patient under the configured SPA base',
      '^/patient/([^/]+)/chart(?:/|$)',
      'http://localhost/openmrs/spa/patient/abc-123/chart/vitals',
      'http://localhost/openmrs/spa/patient/abc-123/chart/conditions',
      false,
    ],
    [
      'closes: different patient under the configured SPA base',
      '^/patient/([^/]+)/chart(?:/|$)',
      'http://localhost/openmrs/spa/patient/abc-123/chart/vitals',
      'http://localhost/openmrs/spa/patient/def-456/chart/vitals',
      true,
    ],
    [
      'closes: route only shares the SPA base as a string prefix',
      '^/patient/([^/]+)/chart(?:/|$)',
      'http://localhost/openmrs/spa2/patient/abc-123/chart/vitals',
      'http://localhost/openmrs/spa2/patient/abc-123/chart/conditions',
      true,
    ],
    [
      'closes: navigation leaves the configured SPA base',
      '^/patient/([^/]+)/chart(?:/|$)',
      'http://localhost/openmrs/spa/patient/abc-123/chart/vitals',
      'http://localhost/patient/abc-123/chart/conditions',
      true,
    ],
    [
      'closes: route only shares the patient chart prefix',
      '^/patient/([^/]+)/chart(?:/|$)',
      'http://localhost/openmrs/spa/patient/abc-123/chart',
      'http://localhost/openmrs/spa/patient/abc-123/chart-extra',
      true,
    ],
    [
      'stays open: legacy pattern includes the configured SPA base',
      '^/openmrs/spa/patient/([^/]+)/chart(?:/|$)',
      'http://localhost/openmrs/spa/patient/abc-123/chart/vitals',
      'http://localhost/openmrs/spa/patient/abc-123/chart/conditions',
      false,
    ],
    [
      'stays open: legacy pattern matches both full pathnames when only one relative pathname matches',
      '^/openmrs',
      'http://localhost/openmrs/spa/home',
      'http://localhost/openmrs/spa/openmrs-lab',
      false,
    ],
    [
      'closes: legacy pattern captures a different patient',
      '^/openmrs/spa/patient/([^/]+)/chart(?:/|$)',
      'http://localhost/openmrs/spa/patient/abc-123/chart/vitals',
      'http://localhost/openmrs/spa/patient/def-456/chart/vitals',
      true,
    ],
  ])('%s', (_desc, pattern, oldUrl, newUrl, expected) => {
    withSpaBase('/openmrs/spa/', () => {
      expect(shouldCloseOnUrlChange(pattern, oldUrl, newUrl)).toBe(expected);
    });
  });

  it('matches against full pathnames when getOpenmrsSpaBase is not defined', () => {
    const originalGetOpenmrsSpaBase = window.getOpenmrsSpaBase;
    // @ts-expect-error simulating an environment without the app shell globals
    delete window.getOpenmrsSpaBase;

    try {
      expect(shouldCloseOnUrlChange('^/home/appointments', '/home/appointments', '/home/appointments/details')).toBe(
        false,
      );
      expect(shouldCloseOnUrlChange('^/home/appointments', '/home/appointments', '/home/service-queues')).toBe(true);
    } finally {
      window.getOpenmrsSpaBase = originalGetOpenmrsSpaBase;
    }
  });

  it('matches against a custom SPA base', () => {
    withSpaBase('/custom/spa/', () => {
      expect(
        shouldCloseOnUrlChange(
          '^/patient/([^/]+)/chart(?:/|$)',
          '/custom/spa/patient/abc-123/chart/vitals',
          '/custom/spa/patient/abc-123/chart/conditions',
        ),
      ).toBe(false);
    });
  });
});

function withSpaBase<T>(spaBase: string, callback: () => T): T {
  const originalGetOpenmrsSpaBase = window.getOpenmrsSpaBase;
  window.getOpenmrsSpaBase = () => spaBase;

  try {
    return callback();
  } finally {
    window.getOpenmrsSpaBase = originalGetOpenmrsSpaBase;
  }
}
