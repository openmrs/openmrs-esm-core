import { beforeEach, describe, expect, it } from 'vitest';
import {
  configInternalStore,
  implementerToolsConfigStore,
  setImplementerToolsConfigRecomputer,
  temporaryConfigStore,
} from './state';
import { defineConfigSchema, provide, registerModuleLoad, resetConfigSystem } from './module-config';
import { Type } from '../types';

/**
 * The implementer tools config is derived lazily — only while something is subscribed to it — so
 * these cover the two ways it can be read, and the transition back to lazy when the last
 * subscriber goes away.
 */
describe('implementer tools config', () => {
  beforeEach(() => {
    temporaryConfigStore.setState({ config: {} });
    configInternalStore.setState({ providedConfigs: [], schemas: {}, moduleLoaded: {} });
    resetConfigSystem();
    defineConfigSchema('esm-flintstone', {
      label: { _type: Type.String, _default: 'default-label', _description: 'x' },
    });
    registerModuleLoad('esm-flintstone');
  });

  it('derives on demand when nothing is subscribed', () => {
    provide({ 'esm-flintstone': { label: 'provided-label' } });

    const config = implementerToolsConfigStore.getState().config as never;

    expect(config['esm-flintstone'].label._value).toBe('provided-label');
    expect(config['esm-flintstone'].label._source).toBe('provided');
  });

  it('keeps a subscriber up to date as the config changes', () => {
    const seen: Array<unknown> = [];
    const unsubscribe = implementerToolsConfigStore.subscribe((state) => seen.push(state.config));

    provide({ 'esm-flintstone': { label: 'first' } });
    expect((implementerToolsConfigStore.getState().config as never)['esm-flintstone'].label._value).toBe('first');

    temporaryConfigStore.setState({ config: { 'esm-flintstone': { label: 'second' } } });
    expect((implementerToolsConfigStore.getState().config as never)['esm-flintstone'].label._value).toBe('second');

    expect(seen.length).toBeGreaterThanOrEqual(2);
    unsubscribe();
  });

  it('still reports the current config after the last subscriber goes away', () => {
    const unsubscribe = implementerToolsConfigStore.subscribe(() => {});
    provide({ 'esm-flintstone': { label: 'while-subscribed' } });
    unsubscribe();

    // Back to deriving lazily; a read still has to see changes made while nothing was watching.
    temporaryConfigStore.setState({ config: { 'esm-flintstone': { label: 'after-unsubscribe' } } });

    expect((implementerToolsConfigStore.getState().config as never)['esm-flintstone'].label._value).toBe(
      'after-unsubscribe',
    );
  });

  it('includes a module that is configured but never declared a schema', () => {
    provide({ 'esm-no-schema': { someSetting: 'configured' } });

    const config = implementerToolsConfigStore.getState().config as never;

    // Merging happens per module, so a module present only in a provided config still has to
    // reach the output.
    expect(config['esm-no-schema'].someSetting._value).toBe('configured');
    expect(config['esm-flintstone'].label._value).toBe('default-label');
  });

  it('layers sources for one module, with later sources winning', () => {
    defineConfigSchema('esm-rubble', {
      nested: {
        kept: { _type: Type.String, _default: 'from-schema', _description: 'x' },
        overridden: { _type: Type.String, _default: 'from-schema', _description: 'x' },
      },
    });
    registerModuleLoad('esm-rubble');

    provide({ 'esm-rubble': { nested: { overridden: 'from-provided' } } });
    temporaryConfigStore.setState({ config: { 'esm-rubble': { nested: { overridden: 'from-temporary' } } } });

    const config = implementerToolsConfigStore.getState().config as never;

    expect(config['esm-rubble'].nested.overridden._value).toBe('from-temporary');
    expect(config['esm-rubble'].nested.overridden._source).toBe('temporary config');
    // Sibling keys the later sources don't mention keep their schema default.
    expect(config['esm-rubble'].nested.kept._value).toBe('from-schema');
    expect(config['esm-rubble'].nested.kept._source).toBe('default');
  });

  it('stops deriving once the last subscriber goes away, and starts again on demand', () => {
    // Counting derivations is the only way to observe the laziness itself; asserting on the value
    // alone passes whether or not the derivation was skipped.
    let derivations = 0;
    const realRecomputer = () => {
      derivations++;
      configInternalStore.setState(configInternalStore.getState());
    };
    setImplementerToolsConfigRecomputer(realRecomputer);

    const unsubscribe = implementerToolsConfigStore.subscribe(() => {});
    derivations = 0;

    provide({ 'esm-flintstone': { label: 'while-subscribed' } });
    expect(derivations).toBe(1);

    unsubscribe();
    provide({ 'esm-flintstone': { label: 'after-unsubscribe' } });
    expect(derivations).toBe(1);

    // ...but a read still pays for one.
    implementerToolsConfigStore.getState();
    expect(derivations).toBe(2);
  });

  it('survives a derivation that throws, and retries on the next read', () => {
    let shouldThrow = true;
    setImplementerToolsConfigRecomputer(() => {
      if (shouldThrow) {
        throw new Error('derivation blew up');
      }
    });

    // A failing derivation must not escape into a store listener, a render, or `subscribe`.
    expect(() => provide({ 'esm-flintstone': { label: 'x' } })).not.toThrow();
    expect(() => implementerToolsConfigStore.getState()).not.toThrow();

    const unsubscribe = implementerToolsConfigStore.subscribe(() => {});
    shouldThrow = false;
    unsubscribe();

    let derived = false;
    setImplementerToolsConfigRecomputer(() => {
      derived = true;
    });
    implementerToolsConfigStore.getState();
    expect(derived).toBe(true);
  });

  it('tolerates unsubscribing twice', () => {
    const unsubscribe = implementerToolsConfigStore.subscribe(() => {});
    unsubscribe();
    unsubscribe();

    // A subscriber count driven below zero would leave `getState` permanently unable to derive.
    temporaryConfigStore.setState({ config: { 'esm-flintstone': { label: 'after-double' } } });
    expect((implementerToolsConfigStore.getState().config as never)['esm-flintstone'].label._value).toBe(
      'after-double',
    );
  });

  it('stays eager while a second subscriber remains', () => {
    const first = implementerToolsConfigStore.subscribe(() => {});
    const second = implementerToolsConfigStore.subscribe(() => {});
    first();

    let notified = 0;
    const third = implementerToolsConfigStore.subscribe(() => notified++);
    provide({ 'esm-flintstone': { label: 'two-watchers' } });
    expect(notified).toBeGreaterThan(0);

    second();
    third();
  });

  it('does not overwrite a config written directly to the store', () => {
    implementerToolsConfigStore.setState({ config: { manual: true } as never });

    expect(implementerToolsConfigStore.getState().config).toEqual({ manual: true });
  });
});
