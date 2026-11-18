import type { OpenmrsAppRoutes, SerializedConfigSchema } from '@openmrs/esm-globals';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const defineStaticConfigSchema = vi.fn();
const defineStaticExtensionConfigSchema = vi.fn();
const registerCustomValidatorLoader = vi.fn();
const registerModuleWithConfigSystem = vi.fn();
const importDynamic = vi.fn();

// Partial: other modules in the graph use the rest of the config API on import, including one
// that defines a schema.
vi.mock('@openmrs/esm-config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@openmrs/esm-config')>()),
  defineStaticConfigSchema,
  defineStaticExtensionConfigSchema,
  registerCustomValidatorLoader,
  registerModuleWithConfigSystem,
}));

vi.mock('@openmrs/esm-dynamic-loading', () => ({ importDynamic }));

// The extension and feature flag systems are left real: registering an app touches most of their
// APIs, and these tests only assert on what reaches the config system.

vi.mock('single-spa', () => ({
  registerApplication: vi.fn(),
  pathToActiveWhen: vi.fn(() => () => false),
}));

const appName = '@openmrs/esm-foo-app';

const configurationSchema: SerializedConfigSchema = {
  greeting: { _type: 'String', _default: 'hello' },
};

const extensionConfigurationSchemas: Record<string, SerializedConfigSchema> = {
  'foo-link': { size: { _type: 'String', _default: 'small' } },
};

async function importPages() {
  return await import('./pages');
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('registering an app from the routes registry', () => {
  it('installs the module schema against the app that shipped it', async () => {
    const { registerApp } = await importPages();

    registerApp(appName, { configurationSchema } as OpenmrsAppRoutes);

    expect(defineStaticConfigSchema).toHaveBeenCalledWith(appName, configurationSchema, appName);
  });

  it('installs each extension schema, attributed to the declaring app', async () => {
    const { registerApp } = await importPages();

    registerApp(appName, { extensionConfigurationSchemas } as OpenmrsAppRoutes);

    // The declaring app exports the custom validators, whichever app renders the extension.
    expect(defineStaticExtensionConfigSchema).toHaveBeenCalledWith(
      'foo-link',
      extensionConfigurationSchemas['foo-link'],
      appName,
    );
  });

  it('registers the app with the config system even when it has no schema', async () => {
    const { registerApp } = await importPages();

    registerApp(appName, {} as OpenmrsAppRoutes);

    expect(registerModuleWithConfigSystem).toHaveBeenCalledWith(appName);
    expect(defineStaticConfigSchema).not.toHaveBeenCalled();
    expect(defineStaticExtensionConfigSchema).not.toHaveBeenCalled();
  });

  it('gives the config system a way to load custom validators off the module federation container', async () => {
    await importPages();

    expect(registerCustomValidatorLoader).toHaveBeenCalledTimes(1);

    const [loader] = registerCustomValidatorLoader.mock.calls[0];
    loader(appName);

    // The dedicated expose, so reaching a validator costs a small chunk, not the whole module.
    expect(importDynamic).toHaveBeenCalledWith(appName, './config-validators');
  });
});
