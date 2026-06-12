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
        workspaces: [
          {
            name: 'custom workspace',
            component: 'customWorkspace',
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

  it('should accept an object with only workspaces', () => {
    expect(
      isOpenmrsAppRoutes({
        workspaces: [
          {
            name: 'custom workspace',
            component: 'customWorkspace',
          },
        ],
      }),
    ).toBe(true);
  });

  it('should report an empty object as valid', () => {
    expect(isOpenmrsAppRoutes({})).toBe(true);
  });
});
