import { describe, expect, it } from 'vitest';
import { isOpenmrsAppRoutes } from './type-utils';

describe('isOpenmrsAppRoutes', () => {
  it('should return true for a valid routes object', () => {
    expect(
      isOpenmrsAppRoutes({
        backendDependencies: {
          fhir2: '^2.0.0',
          'webservices.rest': '^1.4.0',
        },
        version: '1.2.0-pre.12345+build.8',
        pages: [
          {
            component: 'root',
            route: 'myPage',
          },
        ],
        extensions: [
          {
            name: 'custom extension',
            component: 'customExtension',
          },
        ],
        modals: [
          {
            name: 'custom modal',
            component: 'customModal',
          },
        ],
      }),
    ).toBe(true);
  });

  it('should accept an object with only pages', () => {
    expect(
      isOpenmrsAppRoutes({
        pages: [
          {
            component: 'root',
            route: 'myPage',
          },
        ],
      }),
    ).toBe(true);
  });

  it('should accept an object with only extensions', () => {
    expect(
      isOpenmrsAppRoutes({
        extensions: [
          {
            name: 'custom extension',
            component: 'customExtension',
          },
        ],
      }),
    ).toBe(true);
  });

  it('should accept an object with only modals', () => {
    expect(
      isOpenmrsAppRoutes({
        modals: [
          {
            name: 'custom modal',
            component: 'customModal',
          },
        ],
      }),
    ).toBe(true);
  });

  it.each([
    ['workspaces2', { name: 'custom workspace', component: 'customWorkspace', window: 'custom-window' }],
    ['workspaceWindows2', { name: 'custom-window', group: 'custom-group' }],
    ['workspaceGroups2', { name: 'custom-group' }],
  ])('should accept an object with only %s', (key, definition) => {
    expect(isOpenmrsAppRoutes({ [key]: [definition] })).toBe(true);
  });

  it.each(['workspaces2', 'workspaceWindows2', 'workspaceGroups2'])('should reject a non-array %s', (key) => {
    expect(isOpenmrsAppRoutes({ [key]: {} })).toBe(false);
  });

  it('should report an empty object as valid', () => {
    expect(isOpenmrsAppRoutes({})).toBe(true);
  });
});
