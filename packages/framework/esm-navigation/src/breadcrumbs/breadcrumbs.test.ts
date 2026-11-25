import { beforeEach, describe, expect, it } from 'vitest';
import { pathToRegexp } from 'path-to-regexp';
import { getGlobalStore } from '@openmrs/esm-state';
import { getBreadcrumbs, registerBreadcrumb, registerBreadcrumbs } from './db';
import { filterBreadcrumbs, getBreadcrumbsFor } from './filter';
import type { BreadcrumbRegistration, BreadcrumbSettings } from '../types';

describe('breadcrumbs', () => {
  beforeEach(() => {
    getGlobalStore('breadcrumbs')?.setState([], true);
  });

  describe('db (registration and retrieval)', () => {
    it('registers a single breadcrumb with string path', () => {
      const setting: BreadcrumbSettings = {
        path: '/home',
        title: 'Home',
      };

      registerBreadcrumb(setting);

      const breadcrumbs = getBreadcrumbs();
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].settings).toEqual(setting);
      expect(breadcrumbs[0].matcher.test('/home')).toBe(true);
      expect(breadcrumbs[0].matcher.test('/other')).toBe(false);
    });

    it('registers a breadcrumb with custom string matcher containing parameters', () => {
      const setting: BreadcrumbSettings = {
        path: '/patients',
        matcher: '/patient/:id',
        title: 'Patient Details',
      };

      registerBreadcrumb(setting);

      const breadcrumbs = getBreadcrumbs();
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].settings).toEqual(setting);
      expect(breadcrumbs[0].matcher.test('/patient/123')).toBe(true);
      expect(breadcrumbs[0].matcher.test('/patient/abc-xyz')).toBe(true);
      expect(breadcrumbs[0].matcher.test('/other')).toBe(false);
    });

    it('registers a breadcrumb with RegExp matcher', () => {
      const regex = /^\/reports\/[0-9]+$/;
      const setting: BreadcrumbSettings = {
        path: '/reports',
        matcher: regex,
        title: 'Reports',
      };

      registerBreadcrumb(setting);

      const breadcrumbs = getBreadcrumbs();
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].matcher).toBe(regex);
      expect(breadcrumbs[0].matcher.test('/reports/42')).toBe(true);
      expect(breadcrumbs[0].matcher.test('/reports/abc')).toBe(false);
    });

    it('registers multiple breadcrumbs at once', () => {
      const settings: Array<BreadcrumbSettings> = [
        { path: '/home', title: 'Home' },
        { path: '/settings', title: 'Settings' },
      ];

      registerBreadcrumbs(settings);

      const breadcrumbs = getBreadcrumbs();
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0].settings.title).toBe('Home');
      expect(breadcrumbs[1].settings.title).toBe('Settings');
    });
  });

  describe('filterBreadcrumbs', () => {
    function makeRegistration(settings: BreadcrumbSettings): BreadcrumbRegistration {
      let matcher: RegExp;
      if (settings.matcher instanceof RegExp) {
        matcher = settings.matcher;
      } else if (typeof settings.matcher === 'string') {
        matcher = pathToRegexp(settings.matcher).regexp;
      } else {
        matcher = pathToRegexp(settings.path).regexp;
      }
      return { matcher, settings };
    }

    it('returns empty array when list is empty', () => {
      expect(filterBreadcrumbs([], '/home')).toEqual([]);
    });

    it('returns empty array when path does not match any breadcrumb', () => {
      const list = [makeRegistration({ path: '/home', title: 'Home' })];
      expect(filterBreadcrumbs(list, '/unknown')).toEqual([]);
    });

    it('returns single breadcrumb when exact path matches without parent', () => {
      const list = [makeRegistration({ path: '/home', title: 'Home' })];
      const result = filterBreadcrumbs(list, '/home');

      expect(result).toHaveLength(1);
      expect(result[0].settings.title).toBe('Home');
    });

    it('returns breadcrumbs hierarchy in order from root to current', () => {
      const home = makeRegistration({ path: '/home', title: 'Home' });
      const patients = makeRegistration({ path: '/home/patients', parent: '/home', title: 'Patients' });
      const chart = makeRegistration({
        path: '/home/patients/:id',
        parent: '/home/patients',
        title: 'Patient Chart',
      });

      const list = [home, patients, chart];
      const result = filterBreadcrumbs(list, '/home/patients/123');

      expect(result).toHaveLength(3);
      expect(result[0].settings.title).toBe('Home');
      expect(result[1].settings.title).toBe('Patients');
      expect(result[2].settings.title).toBe('Patient Chart');
    });

    it('matches closest ancestor when exact path is not registered', () => {
      const home = makeRegistration({ path: '/home', title: 'Home' });
      const details = makeRegistration({ path: '/home/details', parent: '/home', title: 'Details' });

      const list = [home, details];
      const result = filterBreadcrumbs(list, '/home/details/subview');

      expect(result).toHaveLength(2);
      expect(result[0].settings.title).toBe('Home');
      expect(result[1].settings.title).toBe('Details');
    });

    it('prevents infinite loop when parent refers to itself', () => {
      const circular = makeRegistration({ path: '/loop', parent: '/loop', title: 'Loop' });

      const result = filterBreadcrumbs([circular], '/loop');
      expect(result).toHaveLength(1);
      expect(result[0].settings.title).toBe('Loop');
    });

    it('prevents infinite loop on circular parent references', () => {
      const a = makeRegistration({ path: '/a', parent: '/b', title: 'A' });
      const b = makeRegistration({ path: '/b', parent: '/a', title: 'B' });

      const result = filterBreadcrumbs([a, b], '/a');
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.settings.title)).toEqual(['B', 'A']);
    });
  });

  describe('getBreadcrumbsFor', () => {
    it('retrieves and filters breadcrumbs from global store', () => {
      registerBreadcrumbs([
        { path: '/dashboard', title: 'Dashboard' },
        { path: '/dashboard/users', parent: '/dashboard', title: 'Users' },
      ]);

      const result = getBreadcrumbsFor('/dashboard/users');
      expect(result).toHaveLength(2);
      expect(result[0].settings.title).toBe('Dashboard');
      expect(result[1].settings.title).toBe('Users');
    });
  });
});
