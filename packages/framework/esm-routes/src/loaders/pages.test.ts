import type { OpenmrsAppRoutes, SerializedConfigSchema } from '@openmrs/esm-globals';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const defineStaticConfigSchema = vi.fn();
const defineStaticExtensionConfigSchema = vi.fn();
const registerCustomValidatorLoader = vi.fn();
const registerModuleWithConfigSystem = vi.fn();
const importDynamic = vi.fn();

// Partial, because other modules in the graph reach for the rest of the config API while being
// imported, and one of them defines a schema at module scope.
vi.mock('@openmrs/esm-config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@openmrs/esm-config')>()),
  defineStaticConfigSchema,
  defineStaticExtensionConfigSchema,
  registerCustomValidatorLoader,
  registerModuleWithConfigSystem,
}));

vi.mock('@openmrs/esm-dynamic-loading', () => ({ importDynamic }));

// The extension and feature flag systems are left real. Registering an app touches most of their
// APIs, and stubbing them would mean tracking their export lists for no benefit: these tests assert
// on what reaches the config system, and the real registries are happy to be written to.

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

    // Attributed to the app that declared the extension, because that is whose
    // `./config-validators` any custom validators are exported from, regardless of which app ends
    // up rendering the extension.
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

    // The dedicated expose, not the module's own entry point: reaching a validator is supposed to
    // cost a small chunk rather than the whole module and its side effects.
    expect(importDynamic).toHaveBeenCalledWith(appName, './config-validators');
  });
});
