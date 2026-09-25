import type { SerializedConfigSchema } from '@openmrs/esm-globals';
import type { MockedStore } from '@openmrs/esm-state/mock';
import { mockStores } from '@openmrs/esm-state/mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Type } from '../types';
import * as Config from './module-config';
import type { ConfigInternalStore } from './state';
import { configInternalStore, getConfigStore, setConfigValidationEnabled, temporaryConfigStore } from './state';

vi.mock('@openmrs/esm-state', () => import('@openmrs/esm-state/mock'));

const mockConfigInternalStore = configInternalStore as MockedStore<ConfigInternalStore>;
const mockTemporaryConfigStore = temporaryConfigStore as MockedStore<object>;

const moduleName = '@openmrs/esm-foo-app';

const fooSchema: SerializedConfigSchema = {
  greeting: { _type: 'String', _default: 'hello', _description: 'What to say' },
  count: { _type: 'Number', _default: 3, _validators: [{ type: 'positiveInteger' }] },
};

function resetAll() {
  mockConfigInternalStore.resetMock();
  mockTemporaryConfigStore.resetMock();

  for (const storeName of Object.keys(mockStores)) {
    if (storeName.startsWith('config-module-') || storeName.startsWith('config-extension')) {
      delete mockStores[storeName];
    }
  }

  Config.resetConfigSystem();
  Config.clearConfigErrors();
  setConfigValidationEnabled(false);
  setEnvironment(undefined);
}

/** Stands in for the app shell having declared the environment, which it does while starting up. */
function setEnvironment(env: 'production' | 'development' | undefined) {
  Object.defineProperty(window, 'spaEnv', { value: env, writable: true, configurable: true });
}

beforeEach(resetAll);
afterEach(resetAll);

describe('a schema installed from the routes registry', () => {
  it('configures a module that has never been loaded', () => {
    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);
    Config.provide({ [moduleName]: { greeting: 'howdy' } });

    const { config, loaded } = getConfigStore(moduleName).getState();

    expect(loaded).toBe(true);
    expect(config).toMatchObject({ greeting: 'howdy', count: 3 });
  });

  it('restores a default of undefined, which JSON has no way to write down', () => {
    // The serializer omits `_default` when it is `undefined`, so a leaf declared that way arrives
    // with no default at all. `validateConfigSchema` reads a node with no `_default` as a group of
    // nested keys and reports its `_type` as a bad definition, which is what `Display
    // conditions.expression` would hit on every module in the distribution.
    setConfigValidationEnabled(true);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    Config.defineStaticConfigSchema(moduleName, { ...fooSchema, optional: { _type: 'String' } }, moduleName);

    const { config } = getConfigStore(moduleName).getState();

    expect(consoleError).not.toHaveBeenCalled();
    expect(config).toHaveProperty('optional');
    expect(config?.optional).toBeUndefined();

    consoleError.mockRestore();
  });

  it('survives the app being registered again', () => {
    // Registering an app announces the module and then installs its schema. Announcing it hands a
    // module with no schema the implicit one, so doing that a second time would overwrite the
    // static schema, and the first-source-wins guard would then decline to put it back.
    Config.registerModuleWithConfigSystem(moduleName);
    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);

    Config.registerModuleWithConfigSystem(moduleName);
    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);

    expect(getConfigStore(moduleName).getState().config).toMatchObject({ greeting: 'hello', count: 3 });
  });

  it('is not replaced by the module defining its schema when it loads', () => {
    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);

    Config.defineConfigSchema(moduleName, {
      greeting: { _type: Type.String, _default: 'a different default', _description: 'Drift' },
    });

    expect(getConfigStore(moduleName).getState().config).toMatchObject({ greeting: 'hello', count: 3 });
  });

  it('keeps the first schema when two apps declare the same extension name', () => {
    const schema: SerializedConfigSchema = { size: { _type: 'String', _default: 'small' } };
    const other: SerializedConfigSchema = { size: { _type: 'String', _default: 'large' } };

    Config.defineStaticExtensionConfigSchema('an-extension', schema, '@openmrs/esm-first-app');
    Config.defineStaticExtensionConfigSchema('an-extension', other, '@openmrs/esm-second-app');

    expect(configInternalStore.getState().schemas['an-extension'].size).toMatchObject({ _default: 'small' });
  });

  it('does not start deriving a module config for an extension name', () => {
    // Extension schemas live in the same map as module schemas but an extension is not a module:
    // its config is derived separately. Treating one as a module here would run its validators on
    // every recomputation and hand out a config for a module that does not exist.
    Config.defineStaticExtensionConfigSchema('an-extension', fooSchema, moduleName);

    expect(getConfigStore('an-extension').getState().loaded).toBe(false);
  });

  it('still lets a module with no registry entry define its schema by executing', () => {
    Config.defineConfigSchema(moduleName, {
      greeting: { _type: Type.String, _default: 'from the module', _description: 'Runtime' },
    });

    expect(getConfigStore(moduleName).getState().config).toMatchObject({ greeting: 'from the module' });
  });
});

describe('the initial configuration load', () => {
  it('does not report a module as loaded until the configs have been provided', () => {
    Config.beginInitialConfigLoad();
    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);

    expect(getConfigStore(moduleName).getState().loaded).toBe(false);

    Config.provide({ [moduleName]: { greeting: 'howdy' } });
    Config.finishInitialConfigLoad();

    expect(getConfigStore(moduleName).getState().loaded).toBe(true);
  });

  it('holds getConfig until then, rather than resolving it against defaults forever', async () => {
    Config.beginInitialConfigLoad();
    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);

    const pending = Config.getConfig(moduleName);
    const raced = await Promise.race([pending, Promise.resolve('still waiting')]);

    expect(raced).toBe('still waiting');

    Config.provide({ [moduleName]: { greeting: 'howdy' } });
    Config.finishInitialConfigLoad();

    await expect(pending).resolves.toMatchObject({ greeting: 'howdy' });
  });
});

describe('deferring validation', () => {
  it('says nothing about an unknown config key in production', () => {
    setEnvironment('production');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);
    Config.provide({ [moduleName]: { notAKey: true } });

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('reports it outside production', () => {
    setEnvironment('development');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);
    Config.provide({ [moduleName]: { notAKey: true } });

    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('notAKey'));
    consoleError.mockRestore();
  });

  it('reports it in production once something turns validation on', () => {
    setEnvironment('production');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    Config.defineStaticConfigSchema(moduleName, fooSchema, moduleName);
    Config.provide({ [moduleName]: { notAKey: true } });
    expect(consoleError).not.toHaveBeenCalled();

    setConfigValidationEnabled(true);
    Config.provide({ [moduleName]: { greeting: 'howdy' } });

    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('notAKey'));
    consoleError.mockRestore();
  });
});

describe('custom validators', () => {
  const schemaWithCustomValidator: SerializedConfigSchema = {
    count: { _type: 'Number', _default: 3, _validators: [{ type: 'custom', export: 'checkCount' }] },
  };

  it('are not fetched at all while nothing is going to run them', () => {
    setEnvironment('production');
    const loader = vi.fn().mockResolvedValue({});

    Config.registerCustomValidatorLoader(loader);
    Config.defineStaticConfigSchema(moduleName, schemaWithCustomValidator, moduleName);
    Config.provide({ [moduleName]: { count: 5 } });

    expect(loader).not.toHaveBeenCalled();
  });

  it('are fetched from the owning app and applied once validation runs', async () => {
    setEnvironment('development');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const checkCount = vi.fn((value: number) => (value > 4 ? 'too many' : undefined));
    const loader = vi.fn().mockResolvedValue({ checkCount });

    Config.registerCustomValidatorLoader(loader);
    Config.defineStaticConfigSchema(moduleName, schemaWithCustomValidator, moduleName);
    Config.provide({ [moduleName]: { count: 5 } });

    await vi.waitFor(() => expect(loader).toHaveBeenCalledWith(moduleName));
    await vi.waitFor(() => expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('too many')));

    consoleError.mockRestore();
  });

  it('leave the rest of the schema working when the app cannot be loaded', async () => {
    setEnvironment('development');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const loader = vi.fn().mockRejectedValue(new Error('offline'));

    Config.registerCustomValidatorLoader(loader);
    Config.defineStaticConfigSchema(moduleName, schemaWithCustomValidator, moduleName);
    Config.provide({ [moduleName]: { count: 5 } });

    await vi.waitFor(() => expect(loader).toHaveBeenCalled());

    expect(getConfigStore(moduleName).getState().config).toMatchObject({ count: 5 });
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('custom configuration validators'),
      expect.any(Error),
    );

    consoleError.mockRestore();
  });

  it('is asked for each app only once, however often the config is rebuilt', async () => {
    setEnvironment('development');
    const loader = vi.fn().mockResolvedValue({ checkCount: () => undefined });

    Config.registerCustomValidatorLoader(loader);
    Config.defineStaticConfigSchema(moduleName, schemaWithCustomValidator, moduleName);

    Config.provide({ [moduleName]: { count: 5 } });
    Config.provide({ [moduleName]: { count: 6 } });
    Config.provide({ [moduleName]: { count: 7 } });

    await vi.waitFor(() => expect(loader).toHaveBeenCalled());

    expect(loader).toHaveBeenCalledTimes(1);
  });
});
