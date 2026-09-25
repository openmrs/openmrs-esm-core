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

describe('isOpenmrsAppRoutes with config schemas', () => {
  // This predicate also guards the route overrides a developer can hand-write into local storage,
  // so it is what stands between a typo there and a malformed config schema reaching the
  // configuration system.
  it('should accept a routes object carrying a config schema', () => {
    expect(
      isOpenmrsAppRoutes({
        configurationSchema: { foo: { _type: 'String', _default: 'bar' } },
        extensionConfigurationSchemas: { 'my-extension': { baz: { _type: 'Number', _default: 1 } } },
      }),
    ).toBe(true);
  });

  it('should accept empty schemas', () => {
    expect(isOpenmrsAppRoutes({ configurationSchema: {}, extensionConfigurationSchemas: {} })).toBe(true);
  });

  it.each([null, 'a string', 42, ['an array']])('should reject %p as a configurationSchema', (configurationSchema) => {
    expect(isOpenmrsAppRoutes({ configurationSchema })).toBe(false);
  });

  it('should reject an extensionConfigurationSchemas that is not an object', () => {
    expect(isOpenmrsAppRoutes({ extensionConfigurationSchemas: ['nope'] })).toBe(false);
  });

  it('should reject an extension schema that is not an object', () => {
    expect(isOpenmrsAppRoutes({ extensionConfigurationSchemas: { 'my-extension': 'nope' } })).toBe(false);
  });
});
