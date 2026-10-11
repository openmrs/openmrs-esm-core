/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cleanupObsoleteFeatureFlags,
  featureFlagsStore,
  getFeatureFlag,
  registerFeatureFlag,
  setFeatureFlag,
  subscribeToFeatureFlag,
} from './feature-flags';

describe('esm-feature-flags', () => {
  let unsubscribers: Array<() => void> = [];

  beforeEach(() => {
    localStorage.clear();
    featureFlagsStore.setState({ flags: {} }, true);
    unsubscribers = [];
  });

  afterEach(() => {
    unsubscribers.forEach((unsub) => unsub());
    unsubscribers = [];
  });

  describe('registerFeatureFlag', () => {
    it('registers a new feature flag disabled by default', () => {
      registerFeatureFlag('flag-a', 'Flag A', 'Description of flag A');

      expect(getFeatureFlag('flag-a')).toBe(false);
      expect(featureFlagsStore.getState().flags['flag-a']).toEqual({
        enabled: false,
        label: 'Flag A',
        description: 'Description of flag A',
      });
    });

    it('preserves existing enabled state when re-registering a flag', () => {
      registerFeatureFlag('flag-b', 'Flag B', 'Description of flag B');
      setFeatureFlag('flag-b', true);
      expect(getFeatureFlag('flag-b')).toBe(true);

      registerFeatureFlag('flag-b', 'Flag B Updated', 'Updated description');
      expect(getFeatureFlag('flag-b')).toBe(true);
      expect(featureFlagsStore.getState().flags['flag-b'].label).toBe('Flag B Updated');
    });
  });

  describe('getFeatureFlag', () => {
    it('returns false safely without throwing when flag is not registered', () => {
      expect(getFeatureFlag('non-existent-flag')).toBe(false);
    });

    it('returns the current boolean state of the flag', () => {
      registerFeatureFlag('flag-c', 'Flag C', 'Description C');
      expect(getFeatureFlag('flag-c')).toBe(false);

      setFeatureFlag('flag-c', true);
      expect(getFeatureFlag('flag-c')).toBe(true);

      setFeatureFlag('flag-c', false);
      expect(getFeatureFlag('flag-c')).toBe(false);
    });
  });

  describe('setFeatureFlag', () => {
    it('updates enabled state of an existing flag', () => {
      registerFeatureFlag('flag-d', 'Flag D', 'Description D');
      setFeatureFlag('flag-d', true);

      expect(getFeatureFlag('flag-d')).toBe(true);
      expect(featureFlagsStore.getState().flags['flag-d'].label).toBe('Flag D');
    });

    it('handles setting state on uninitialized flag gracefully', () => {
      setFeatureFlag('unregistered-flag', true);

      expect(getFeatureFlag('unregistered-flag')).toBe(true);
      expect(featureFlagsStore.getState().flags['unregistered-flag'].enabled).toBe(true);
    });
  });

  describe('subscribeToFeatureFlag', () => {
    it('immediately calls callback with current flag value', () => {
      registerFeatureFlag('flag-sub-1', 'Flag Sub 1', 'Desc');
      setFeatureFlag('flag-sub-1', true);
      const callback = vi.fn();

      unsubscribers.push(subscribeToFeatureFlag('flag-sub-1', callback));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('immediately calls callback with false for unregistered flag', () => {
      const callback = vi.fn();

      unsubscribers.push(subscribeToFeatureFlag('unregistered-sub', callback));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(false);
    });

    it('notifies callback when flag value changes', () => {
      registerFeatureFlag('flag-sub-2', 'Flag Sub 2', 'Desc');
      const callback = vi.fn();

      unsubscribers.push(subscribeToFeatureFlag('flag-sub-2', callback));
      expect(callback).toHaveBeenLastCalledWith(false);

      setFeatureFlag('flag-sub-2', true);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(true);

      setFeatureFlag('flag-sub-2', false);
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenLastCalledWith(false);
    });

    it('does not invoke callback when an unrelated flag changes', () => {
      registerFeatureFlag('flag-x', 'Flag X', 'Desc X');
      registerFeatureFlag('flag-y', 'Flag Y', 'Desc Y');
      const callback = vi.fn();

      unsubscribers.push(subscribeToFeatureFlag('flag-x', callback));
      expect(callback).toHaveBeenCalledTimes(1);

      setFeatureFlag('flag-y', true);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('stops receiving updates after unsubscribing', () => {
      registerFeatureFlag('flag-sub-3', 'Flag Sub 3', 'Desc');
      const callback = vi.fn();

      const unsubscribe = subscribeToFeatureFlag('flag-sub-3', callback);
      unsubscribers.push(unsubscribe);
      expect(callback).toHaveBeenCalledTimes(1);

      setFeatureFlag('flag-sub-3', true);
      expect(callback).toHaveBeenCalledTimes(2);

      unsubscribe();

      setFeatureFlag('flag-sub-3', false);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('catches synchronous state modifications made during the initial callback invocation', () => {
      registerFeatureFlag('flag-sync', 'Flag Sync', 'Desc');
      const receivedValues: Array<boolean> = [];

      unsubscribers.push(
        subscribeToFeatureFlag('flag-sync', (value) => {
          receivedValues.push(value);
          if (!value) {
            setFeatureFlag('flag-sync', true);
          }
        }),
      );

      expect(receivedValues).toEqual([false, true]);
      expect(getFeatureFlag('flag-sync')).toBe(true);
    });
  });

  describe('cleanupObsoleteFeatureFlags', () => {
    it('removes stale feature flags and metadata from localStorage', () => {
      localStorage.setItem('openmrs:feature-flag:active-flag', 'true');
      localStorage.setItem('openmrs:feature-flag-meta:active-flag', JSON.stringify({ label: 'Active', description: '' }));
      localStorage.setItem('openmrs:feature-flag:stale-flag', 'true');
      localStorage.setItem('openmrs:feature-flag-meta:stale-flag', JSON.stringify({ label: 'Stale', description: '' }));

      registerFeatureFlag('active-flag', 'Active', '');
      setFeatureFlag('active-flag', true);
      cleanupObsoleteFeatureFlags();

      expect(localStorage.getItem('openmrs:feature-flag:active-flag')).toBe('true');
      expect(localStorage.getItem('openmrs:feature-flag:stale-flag')).toBeNull();
      expect(localStorage.getItem('openmrs:feature-flag-meta:stale-flag')).toBeNull();
    });
  });

  describe('localStorage sync', () => {
    it('persists flag state and metadata to localStorage on store update', () => {
      registerFeatureFlag('persisted-flag', 'Persisted', 'Persisted description');
      setFeatureFlag('persisted-flag', true);

      expect(localStorage.getItem('openmrs:feature-flag:persisted-flag')).toBe('true');
      expect(JSON.parse(localStorage.getItem('openmrs:feature-flag-meta:persisted-flag') || '{}')).toEqual({
        label: 'Persisted',
        description: 'Persisted description',
      });
    });
  });
});
