import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  contextStore,
  getContext,
  registerContext,
  subscribeToContext,
  unregisterContext,
  updateContext,
} from './context';

describe('esm-context', () => {
  beforeEach(() => {
    // Reset the context store state between tests
    contextStore.setState({}, true);
  });

  describe('registerContext', () => {
    it('registers a namespace with an empty object as default initial value', () => {
      registerContext('test-namespace');
      expect(getContext('test-namespace')).toEqual({});
    });

    it('registers a namespace with a provided initial value', () => {
      const initialValue = { user: 'admin', role: 'clinician' };
      registerContext('user-context', initialValue);
      expect(getContext('user-context')).toEqual(initialValue);
    });

    it('throws an error when attempting to re-register an already-registered namespace', () => {
      registerContext('duplicate-namespace', { count: 1 });
      expect(() => {
        registerContext('duplicate-namespace', { count: 2 });
      }).toThrow(/Attempted to re-register namespace duplicate-namespace/);
    });
  });

  describe('unregisterContext', () => {
    it('removes an existing namespace and all associated data', () => {
      registerContext('temp-namespace', { active: true });
      expect(getContext('temp-namespace')).toEqual({ active: true });

      unregisterContext('temp-namespace');
      expect(getContext('temp-namespace')).toBeNull();
    });

    it('does not throw when attempting to unregister a non-existent namespace', () => {
      expect(() => {
        unregisterContext('non-existent-namespace');
      }).not.toThrow();
    });
  });

  describe('getContext', () => {
    it('returns null if the namespace is not registered', () => {
      expect(getContext('unknown-namespace')).toBeNull();
    });

    it('returns a frozen (immutable) object of the current namespace state', () => {
      registerContext('immutable-ns', { key: 'value' });
      const context = getContext<{ key: string }>('immutable-ns');

      expect(context).toEqual({ key: 'value' });
      expect(Object.isFrozen(context)).toBe(true);
    });

    it('applies a custom selector function when provided', () => {
      interface PatientContext {
        patient: { id: string; name: string };
        visits: Array<string>;
      }

      registerContext<PatientContext>('patient-ns', {
        patient: { id: '123', name: 'John Doe' },
        visits: ['v1', 'v2'],
      });

      const selectedName = getContext<PatientContext, { name: string }>('patient-ns', (state) => ({
        name: state.patient.name,
      }));

      expect(selectedName).toEqual({ name: 'John Doe' });
      expect(Object.isFrozen(selectedName)).toBe(true);
    });
  });

  describe('updateContext', () => {
    it('updates an existing namespace state via updater function', () => {
      registerContext('counter-ns', { count: 0 });
      updateContext<{ count: number }>('counter-ns', (state) => ({
        ...state,
        count: state.count + 1,
      }));

      expect(getContext('counter-ns')).toEqual({ count: 1 });
    });

    it('automatically registers and initializes namespace if it does not already exist', () => {
      expect(getContext('auto-ns')).toBeNull();

      updateContext('auto-ns', (state) => ({
        ...state,
        initialized: true,
      }));

      expect(getContext('auto-ns')).toEqual({ initialized: true });
    });

    it('preserves other namespaces when updating a specific namespace', () => {
      registerContext('ns-1', { value: 1 });
      registerContext('ns-2', { value: 2 });

      updateContext<{ value: number }>('ns-1', (state) => ({ value: state.value + 10 }));

      expect(getContext('ns-1')).toEqual({ value: 11 });
      expect(getContext('ns-2')).toEqual({ value: 2 });
    });
  });

  describe('subscribeToContext', () => {
    it('immediately calls callback with initial state', () => {
      registerContext('sub-ns', { initialized: true });
      const callback = vi.fn();

      subscribeToContext('sub-ns', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({ initialized: true });
    });

    it('immediately calls callback with null if namespace is not registered', () => {
      const callback = vi.fn();

      subscribeToContext('unregistered-sub-ns', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null);
    });

    it('calls callback when the subscribed namespace is updated', () => {
      registerContext('sub-ns', { count: 0 });
      const callback = vi.fn();

      subscribeToContext('sub-ns', callback);
      expect(callback).toHaveBeenLastCalledWith({ count: 0 });

      updateContext<{ count: number }>('sub-ns', (state) => ({ count: state.count + 1 }));

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith({ count: 1 });
    });

    it('does not invoke callback when an unrelated namespace is updated', () => {
      registerContext('sub-ns-a', { active: true });
      registerContext('sub-ns-b', { count: 0 });
      const callback = vi.fn();

      subscribeToContext('sub-ns-a', callback);
      expect(callback).toHaveBeenCalledTimes(1);

      updateContext<{ count: number }>('sub-ns-b', (state) => ({ count: state.count + 1 }));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('stops receiving updates after unsubscribing', () => {
      registerContext('sub-ns', { count: 0 });
      const callback = vi.fn();

      const unsubscribe = subscribeToContext('sub-ns', callback);
      expect(callback).toHaveBeenCalledTimes(1);

      updateContext<{ count: number }>('sub-ns', (state) => ({ count: 1 }));
      expect(callback).toHaveBeenCalledTimes(2);

      unsubscribe();

      updateContext<{ count: number }>('sub-ns', (state) => ({ count: 2 }));
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
