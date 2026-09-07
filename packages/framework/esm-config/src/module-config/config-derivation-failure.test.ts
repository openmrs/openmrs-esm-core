import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { configInternalStore, implementerToolsConfigStore, temporaryConfigStore } from './state';
import { defineConfigSchema, provide, registerModuleLoad, resetConfigSystem } from './module-config';
import { Type } from '../types';

/**
 * The derivation runs from subscribers to the config system's input stores, so a failure that
 * escapes reaches whichever call happened to write one — an app's `provide()`, an extension
 * mounting, an implementer editing a value in the tools panel — rather than the configuration that
 * caused it.
 *
 * A function is one value `setDefaults` cannot clone; the point is any throw in the derivation,
 * not this particular input.
 */
describe('a configuration that cannot be derived', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    temporaryConfigStore.setState({ config: {} });
    configInternalStore.setState({ providedConfigs: [], schemas: {}, moduleLoaded: {} });
    implementerToolsConfigStore.setState({ config: {}, derivationError: undefined });
    resetConfigSystem();
    defineConfigSchema('esm-probe', { thing: { _type: Type.Object, _default: {} } });
    registerModuleLoad('esm-probe');
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('does not throw out of the call that provided it', () => {
    expect(() => provide({ 'esm-probe': { thing: { fn: () => {} } } })).not.toThrow();
    expect(consoleError).toHaveBeenCalledWith('Failed to recompute the configuration', expect.anything());
  });

  it('does not throw out of an implementer editing a value', () => {
    expect(() => temporaryConfigStore.setState({ config: { 'esm-probe': { thing: { fn: () => {} } } } })).not.toThrow();
  });

  it('is recorded so the implementer tools can report the values they show are out of date', () => {
    provide({ 'esm-probe': { thing: { fn: () => {} } } });

    expect(implementerToolsConfigStore.getState().derivationError).toEqual(
      expect.stringMatching(/could not be cloned/),
    );
  });

  it('leaves the configuration derived before it in place', () => {
    provide({ 'esm-probe': { thing: { good: 'value' } } });

    const before = implementerToolsConfigStore.getState().config;

    provide({ 'esm-probe': { thing: { fn: () => {} } } });

    expect(implementerToolsConfigStore.getState().config).toEqual(before);
  });
});
