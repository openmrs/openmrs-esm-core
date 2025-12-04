import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'zustand/vanilla';
import { createGlobalStore, registerGlobalStore, getGlobalStore, subscribeTo } from './state';

// Helper to generate unique store names for test isolation
let storeCounter = 0;
function getUniqueStoreName(prefix: string = 'test-store'): string {
  return `${prefix}-${++storeCounter}`;
}

describe('createGlobalStore', () => {
  it('should create a new global store with initial state', () => {
    const storeName = getUniqueStoreName();
    const initialState = { count: 0, name: 'test' };

    const store = createGlobalStore(storeName, initialState);

    expect(store).toBeDefined();
    expect(store.getState()).toEqual(initialState);
  });

  it('should allow updating store state', () => {
    const storeName = getUniqueStoreName();
    const initialState = { count: 0 };

    const store = createGlobalStore(storeName, initialState);
    store.setState({ count: 5 });

    expect(store.getState().count).toBe(5);
  });

  it('should warn when creating duplicate store name in non-test environment', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Reset modules to clear cache
    vi.resetModules();

    // Mock the utils module to return false for isTestEnvironment
    vi.doMock('./utils', () => ({
      isTestEnvironment: () => false,
    }));

    // Dynamic import to get the mocked version
    const { createGlobalStore: createGlobalStoreNonTest } = await import('./state');
    const storeName = getUniqueStoreName();

    createGlobalStoreNonTest(storeName, { value: 1 });
    consoleSpy.mockClear();

    createGlobalStoreNonTest(storeName, { value: 2 });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Attempted to override the existing store ${storeName}`),
    );

    consoleSpy.mockRestore();
    vi.doUnmock('./utils');
    vi.resetModules();
  });

  it('should allow duplicate stores in test environment without warning', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const storeName = getUniqueStoreName();

    // Ensure we're in test environment (should already be true)
    process.env.NODE_ENV = 'test';

    createGlobalStore(storeName, { value: 1 });
    createGlobalStore(storeName, { value: 2 });

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should mark store as active', () => {
    const storeName = getUniqueStoreName();
    const store = createGlobalStore(storeName, { active: true });

    // Store should be retrievable and active
    const retrieved = getGlobalStore(storeName);
    expect(retrieved).toBe(store);
  });

  it('should reactivate inactive store with new initial state', () => {
    const storeName = getUniqueStoreName();

    // Create initial store
    const store1 = createGlobalStore(storeName, { value: 1 });

    // Get it (which should mark it as not active when using getGlobalStore on non-existent)
    // Actually, we need to manually deactivate it by creating through getGlobalStore first
    // Let's create a scenario where the store exists but is inactive

    // Use getGlobalStore to create an inactive store
    const inactiveStoreName = getUniqueStoreName();
    const inactiveStore = getGlobalStore(inactiveStoreName, { value: 0 });

    // Now createGlobalStore should reactivate it
    const reactivated = createGlobalStore(inactiveStoreName, { value: 5 });

    expect(reactivated).toBe(inactiveStore);
    expect(reactivated.getState().value).toBe(5);
  });

  it('should use provided initial state', () => {
    const storeName = getUniqueStoreName();
    const complexState = {
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark' },
      items: [1, 2, 3],
    };

    const store = createGlobalStore(storeName, complexState);

    expect(store.getState()).toEqual(complexState);
  });

  it('should return the same store instance when recreating with same name', () => {
    const storeName = getUniqueStoreName();

    const store1 = createGlobalStore(storeName, { value: 1 });
    const store2 = createGlobalStore(storeName, { value: 2 });

    // Should be the same instance
    expect(store1).toBe(store2);
  });
});

describe('registerGlobalStore', () => {
  it('should register an existing Zustand store', () => {
    const storeName = getUniqueStoreName();
    const zustandStore = createStore(() => ({ count: 42 }));

    const registered = registerGlobalStore(storeName, zustandStore);

    expect(registered).toBe(zustandStore);
    expect(registered.getState().count).toBe(42);
  });

  it('should make registered store retrievable via getGlobalStore', () => {
    const storeName = getUniqueStoreName();
    const zustandStore = createStore(() => ({ value: 'test' }));

    registerGlobalStore(storeName, zustandStore);
    const retrieved = getGlobalStore(storeName);

    expect(retrieved).toBe(zustandStore);
  });

  it('should warn when registering duplicate store name in non-test environment', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Reset modules to clear cache
    vi.resetModules();

    // Mock the utils module to return false for isTestEnvironment
    vi.doMock('./utils', () => ({
      isTestEnvironment: () => false,
    }));

    // Dynamic import to get the mocked version
    const { registerGlobalStore: registerGlobalStoreNonTest } = await import('./state');
    const storeName = getUniqueStoreName();

    const store1 = createStore(() => ({ value: 1 }));
    const store2 = createStore(() => ({ value: 2 }));

    registerGlobalStoreNonTest(storeName, store1);
    consoleSpy.mockClear();

    registerGlobalStoreNonTest(storeName, store2);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Attempted to override the existing store ${storeName}`),
    );

    consoleSpy.mockRestore();
    vi.doUnmock('./utils');
    vi.resetModules();
  });

  it('should allow duplicate registrations in test environment', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const storeName = getUniqueStoreName();

    process.env.NODE_ENV = 'test';

    const store1 = createStore(() => ({ value: 1 }));
    const store2 = createStore(() => ({ value: 2 }));

    registerGlobalStore(storeName, store1);
    registerGlobalStore(storeName, store2);

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should mark registered store as active', () => {
    const storeName = getUniqueStoreName();
    const zustandStore = createStore(() => ({ active: true }));

    registerGlobalStore(storeName, zustandStore);

    // Should be retrievable
    const retrieved = getGlobalStore(storeName);
    expect(retrieved).toBe(zustandStore);
  });

  it('should replace inactive store with new registration', () => {
    const storeName = getUniqueStoreName();

    // Create inactive store via getGlobalStore
    const inactiveStore = getGlobalStore(storeName, { value: 0 });

    // Register a new store with same name
    const newStore = createStore(() => ({ value: 99 }));
    const registered = registerGlobalStore(storeName, newStore);

    expect(registered).toBe(newStore);
    expect(registered.getState().value).toBe(99);
  });

  it('should return the same store instance when re-registering active store', () => {
    const storeName = getUniqueStoreName();
    const store1 = createStore(() => ({ value: 1 }));
    const store2 = createStore(() => ({ value: 2 }));

    const registered1 = registerGlobalStore(storeName, store1);
    const registered2 = registerGlobalStore(storeName, store2);

    // Should return the first registered store (active)
    expect(registered1).toBe(registered2);
    expect(registered1).toBe(store1);
  });
});

describe('getGlobalStore', () => {
  it('should return existing store', () => {
    const storeName = getUniqueStoreName();
    const created = createGlobalStore<{ value: string }>(storeName, { value: 'exists' });

    const retrieved = getGlobalStore<{ value: string }>(storeName);

    expect(retrieved).toBe(created);
    expect(retrieved.getState().value).toBe('exists');
  });

  it('should create store on demand if not exists', () => {
    const storeName = getUniqueStoreName();

    const store = getGlobalStore(storeName, { created: 'on-demand' });

    expect(store).toBeDefined();
    expect(store.getState().created).toBe('on-demand');
  });

  it('should use fallback state when creating on demand', () => {
    const storeName = getUniqueStoreName();
    const fallbackState = { name: 'fallback', count: 123 };

    const store = getGlobalStore(storeName, fallbackState);

    expect(store.getState()).toEqual(fallbackState);
  });

  it('should create store with empty object when no fallback provided', () => {
    const storeName = getUniqueStoreName();

    const store = getGlobalStore(storeName);

    expect(store).toBeDefined();
    expect(store.getState()).toEqual({});
  });

  it('should mark on-demand created store as inactive', () => {
    const storeName = getUniqueStoreName();

    // Create via getGlobalStore (inactive)
    const store1 = getGlobalStore(storeName, { value: 1 });

    // Now createGlobalStore should be able to reactivate and replace state
    const store2 = createGlobalStore(storeName, { value: 2 });

    expect(store1).toBe(store2);
    expect(store2.getState().value).toBe(2);
  });

  it('should return existing active store even when fallback is provided', () => {
    const storeName = getUniqueStoreName();

    const created = createGlobalStore(storeName, { value: 'original' });
    const retrieved = getGlobalStore(storeName, { value: 'fallback' });

    expect(retrieved).toBe(created);
    expect(retrieved.getState().value).toBe('original');
  });
});

describe('subscribeTo', () => {
  describe('full state subscription', () => {
    it('should subscribe to entire store state', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { count: 0 });
      const handler = vi.fn();

      subscribeTo(store, handler);

      // Handler should be called immediately with current state
      expect(handler).toHaveBeenCalledWith({ count: 0 });
    });

    it('should call handler on state change', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { count: 0 });
      const handler = vi.fn();

      subscribeTo(store, handler);
      handler.mockClear(); // Clear initial call

      store.setState({ count: 1 });

      expect(handler).toHaveBeenCalledWith({ count: 1 });
    });

    it('should return unsubscribe function', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { count: 0 });
      const handler = vi.fn();

      const unsubscribe = subscribeTo(store, handler);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should stop calling handler after unsubscribe', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { count: 0 });
      const handler = vi.fn();

      const unsubscribe = subscribeTo(store, handler);
      handler.mockClear();

      unsubscribe();

      store.setState({ count: 1 });
      store.setState({ count: 2 });

      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle multiple subscribers', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { value: 'a' });
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      subscribeTo(store, handler1);
      subscribeTo(store, handler2);

      handler1.mockClear();
      handler2.mockClear();

      store.setState({ value: 'b' });

      expect(handler1).toHaveBeenCalledWith({ value: 'b' });
      expect(handler2).toHaveBeenCalledWith({ value: 'b' });
    });
  });

  describe('selected state subscription', () => {
    it('should subscribe to selected portion of state', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { user: { name: 'John' }, count: 5 });
      const handler = vi.fn();
      const selector = (state: any) => state.user;

      subscribeTo(store, selector, handler);

      expect(handler).toHaveBeenCalledWith({ name: 'John' });
    });

    it('should only call handler when selected state changes', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { user: { name: 'John' }, count: 0 });
      const handler = vi.fn();
      const selector = (state: any) => state.user;

      subscribeTo(store, selector, handler);
      handler.mockClear();

      // Change unrelated state
      store.setState({ user: { name: 'John' }, count: 1 });

      // Handler should not be called (user didn't change)
      expect(handler).not.toHaveBeenCalled();
    });

    it('should call handler when selected state changes', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { user: { name: 'John' }, count: 0 });
      const handler = vi.fn();
      const selector = (state: any) => state.user;

      subscribeTo(store, selector, handler);
      handler.mockClear();

      store.setState({ user: { name: 'Jane' }, count: 0 });

      expect(handler).toHaveBeenCalledWith({ name: 'Jane' });
    });

    it('should use shallow equality for change detection', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { items: [1, 2, 3], meta: 'data' });
      const handler = vi.fn();
      const selector = (state: any) => state.items;

      subscribeTo(store, selector, handler);
      handler.mockClear();

      // Set same array reference
      const sameItems = store.getState().items;
      store.setState({ items: sameItems, meta: 'changed' });

      // Handler should not be called (same reference)
      expect(handler).not.toHaveBeenCalled();

      // Set new array with same content - shallowEqual compares array elements
      store.setState({ items: [1, 2, 3], meta: 'changed' });

      // Handler should NOT be called (arrays are shallowEqual)
      expect(handler).not.toHaveBeenCalled();

      // Set new array with different content
      store.setState({ items: [1, 2, 3, 4], meta: 'changed' });

      // Handler should be called (different array content)
      expect(handler).toHaveBeenCalled();
    });

    it('should return unsubscribe function for selected subscription', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { a: 1, b: 2 });
      const handler = vi.fn();
      const selector = (state: any) => state.a;

      const unsubscribe = subscribeTo(store, selector, handler);

      expect(typeof unsubscribe).toBe('function');

      handler.mockClear();
      unsubscribe();

      store.setState({ a: 5, b: 2 });
      expect(handler).not.toHaveBeenCalled();
    });

    it('should work with primitive value selectors', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { count: 0, name: 'test' });
      const handler = vi.fn();
      const selector = (state: any) => state.count;

      subscribeTo(store, selector, handler);

      expect(handler).toHaveBeenCalledWith(0);

      handler.mockClear();
      store.setState({ count: 5, name: 'test' });

      expect(handler).toHaveBeenCalledWith(5);
    });

    it('should handle computed/derived values from selector', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { firstName: 'John', lastName: 'Doe' });
      const handler = vi.fn();
      const selector = (state: any) => `${state.firstName} ${state.lastName}`;

      subscribeTo(store, selector, handler);

      expect(handler).toHaveBeenCalledWith('John Doe');

      handler.mockClear();
      store.setState({ firstName: 'Jane', lastName: 'Doe' });

      expect(handler).toHaveBeenCalledWith('Jane Doe');
    });
  });

  describe('edge cases', () => {
    it('should handle rapid state updates', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { count: 0 });
      const handler = vi.fn();

      subscribeTo(store, handler);
      handler.mockClear();

      // Rapid updates
      for (let i = 1; i <= 10; i++) {
        store.setState({ count: i });
      }

      expect(handler).toHaveBeenCalledTimes(10);
      expect(handler).toHaveBeenLastCalledWith({ count: 10 });
    });

    it('should handle undefined state values', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { value: undefined as string | undefined });
      const handler = vi.fn();

      subscribeTo(store, handler);

      expect(handler).toHaveBeenCalledWith({ value: undefined });
    });

    it('should handle null state values', () => {
      const storeName = getUniqueStoreName();
      const store = createGlobalStore(storeName, { value: null as string | null });
      const handler = vi.fn();

      subscribeTo(store, handler);

      expect(handler).toHaveBeenCalledWith({ value: null });
    });
  });
});
