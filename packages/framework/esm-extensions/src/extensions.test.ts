import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createGlobalStore } from '@openmrs/esm-state';
import { registerFeatureFlag, setFeatureFlag } from '@openmrs/esm-feature-flags';
import type { Session } from '@openmrs/esm-api';
import { sessionStore, userHasAccess } from '@openmrs/esm-api';
import {
  attach,
  detach,
  detachAll,
  getAssignedExtensions,
  getExtensionNameFromId,
  getExtensionRegistration,
  getExtensionRegistrationFrom,
  registerExtension,
  registerExtensionSlot,
  updateExtensionSlotState,
} from './extensions';
import type { ExtensionInfo, ExtensionInternalStore, ExtensionRegistration } from './store';
import { getExtensionInternalStore } from './store';

// Minimal mocking - only what we need for fine-grained control
vi.mock('@openmrs/esm-api', () => ({
  sessionStore: createGlobalStore('mock-session-store', {
    loaded: false,
    session: null,
  }),
  userHasAccess: vi.fn(() => true),
}));

vi.mock('@openmrs/esm-utils', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@openmrs/esm-utils')>();
  return {
    ...actual,
    isOnline: vi.fn(() => true),
  };
});

vi.mock('@openmrs/esm-globals', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@openmrs/esm-globals')>();
  return {
    ...actual,
    subscribeConnectivityChanged: vi.fn(),
  };
});

// Helper to create unique names for test isolation
let nameCounter = 0;
function getUniqueName(prefix: string = 'test'): string {
  return `${prefix}-${++nameCounter}`;
}

// Helper to create a mock extension registration
function createMockExtension(name: string, overrides: Partial<ExtensionRegistration> = {}): ExtensionInfo {
  return {
    name,
    load: vi.fn(async () => ({ bootstrap: vi.fn(), mount: vi.fn(), unmount: vi.fn() })),
    moduleName: `${name}-module`,
    meta: {},
    instances: [],
    ...overrides,
  };
}

describe('getExtensionNameFromId', () => {
  it('should extract the extension name from a simple ID', () => {
    expect(getExtensionNameFromId('foo')).toBe('foo');
  });

  it('should extract the extension name from an ID with # separator', () => {
    expect(getExtensionNameFromId('foo#bar')).toBe('foo');
  });

  it('should extract the extension name from an ID with multiple # separators', () => {
    expect(getExtensionNameFromId('foo#bar#baz')).toBe('foo');
  });

  it('should handle empty string', () => {
    expect(getExtensionNameFromId('')).toBe('');
  });
});

describe('getExtensionRegistrationFrom', () => {
  it('should return the extension registration if it exists', () => {
    const mockExtension = createMockExtension('test-extension');

    const state: ExtensionInternalStore = {
      slots: {},
      extensions: {
        'test-extension': mockExtension,
      },
    };

    expect(getExtensionRegistrationFrom(state, 'test-extension')).toBe(mockExtension);
  });

  it('should return undefined if the extension does not exist', () => {
    const state: ExtensionInternalStore = {
      slots: {},
      extensions: {},
    };

    expect(getExtensionRegistrationFrom(state, 'non-existent')).toBeUndefined();
  });

  it('should handle extension IDs with # separator', () => {
    const mockExtension = createMockExtension('test-extension');

    const state: ExtensionInternalStore = {
      slots: {},
      extensions: {
        'test-extension': mockExtension,
      },
    };

    expect(getExtensionRegistrationFrom(state, 'test-extension#instance1')).toBe(mockExtension);
  });
});

describe('getExtensionRegistration', () => {
  it('should return undefined for non-existent extension', () => {
    const result = getExtensionRegistration('non-existent-extension-xyz');
    expect(result).toBeUndefined();
  });

  it('should return the extension registration for a registered extension', () => {
    const extensionName = getUniqueName('registered-extension');
    const mockExtension = createMockExtension(extensionName);

    registerExtension(mockExtension);

    const result = getExtensionRegistration(extensionName);
    expect(result?.name).toBe(extensionName);
  });

  it('should handle extension IDs with # separator', () => {
    const extensionName = getUniqueName('extension-with-hash');
    const mockExtension = createMockExtension(extensionName);

    registerExtension(mockExtension);

    const result = getExtensionRegistration(`${extensionName}#instance1`);
    expect(result?.name).toBe(extensionName);
  });
});

describe('attach', () => {
  it('should attach an extension to a non-existent slot', () => {
    const slotName = getUniqueName('test-slot');
    const extensionId = 'test-extension';

    attach(slotName, extensionId);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName]).toBeDefined();
    expect(state.slots[slotName].attachedIds).toContain(extensionId);
  });

  it('should attach an extension to an existing slot', () => {
    const slotName = getUniqueName('test-slot-existing');
    const extensionId1 = 'extension-1';
    const extensionId2 = 'extension-2';

    attach(slotName, extensionId1);
    attach(slotName, extensionId2);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].attachedIds).toContain(extensionId1);
    expect(state.slots[slotName].attachedIds).toContain(extensionId2);
  });

  it('should allow attaching the same extension multiple times', () => {
    const slotName = getUniqueName('test-slot-duplicate');
    const extensionId = 'duplicate-extension';

    attach(slotName, extensionId);
    attach(slotName, extensionId);

    const store = getExtensionInternalStore();
    const state = store.getState();

    // Both instances should be in the attachedIds array
    const count = state.slots[slotName].attachedIds.filter((id) => id === extensionId).length;
    expect(count).toBe(2);
  });

  it('should handle extension IDs with # separator', () => {
    const slotName = getUniqueName('test-slot-with-hash');
    const extensionId = 'extension#instance1';

    attach(slotName, extensionId);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].attachedIds).toContain(extensionId);
  });

  it('should create a slot with the correct initial structure', () => {
    const slotName = getUniqueName('test-slot-structure');
    const extensionId = 'test-extension';

    attach(slotName, extensionId);

    const store = getExtensionInternalStore();
    const state = store.getState();
    const slot = state.slots[slotName];

    expect(slot).toEqual({
      moduleName: undefined,
      name: slotName,
      attachedIds: [extensionId],
      config: null,
      state: undefined,
    });
  });
});

describe('detach', () => {
  it('should detach an extension from a slot', () => {
    const slotName = getUniqueName('test-slot-detach');
    const extensionId = 'extension-to-detach';

    attach(slotName, extensionId);
    detach(slotName, extensionId);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].attachedIds).not.toContain(extensionId);
  });

  it('should not throw when detaching from a non-existent slot', () => {
    const slotName = getUniqueName('non-existent-slot');

    expect(() => detach(slotName, 'some-extension')).not.toThrow();
  });

  it('should not throw when detaching a non-attached extension', () => {
    const slotName = getUniqueName('test-slot-no-ext');

    attach(slotName, 'other-extension');

    expect(() => detach(slotName, 'non-attached-extension')).not.toThrow();
  });

  it('should only detach the specified extension', () => {
    const slotName = getUniqueName('test-slot-multi');
    const ext1 = 'extension-1';
    const ext2 = 'extension-2';

    attach(slotName, ext1);
    attach(slotName, ext2);
    detach(slotName, ext1);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].attachedIds).not.toContain(ext1);
    expect(state.slots[slotName].attachedIds).toContain(ext2);
  });

  it('should not modify state when detaching from non-existent slot', () => {
    const slotName = getUniqueName('non-existent-detach');
    const store = getExtensionInternalStore();
    const stateBefore = store.getState();

    detach(slotName, 'some-extension');

    const stateAfter = store.getState();
    expect(stateAfter).toBe(stateBefore);
  });

  it('should not modify state when detaching non-attached extension', () => {
    const slotName = getUniqueName('detach-non-attached');

    attach(slotName, 'existing-extension');

    const store = getExtensionInternalStore();
    const stateBefore = store.getState();

    detach(slotName, 'non-existent-extension');

    const stateAfter = store.getState();
    expect(stateAfter).toBe(stateBefore);
  });
});

describe('detachAll', () => {
  it('should detach all extensions from a slot', () => {
    const slotName = getUniqueName('test-slot-detach-all');

    attach(slotName, 'extension-1');
    attach(slotName, 'extension-2');
    attach(slotName, 'extension-3');

    detachAll(slotName);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].attachedIds).toEqual([]);
  });

  it('should not throw when detaching all from a non-existent slot', () => {
    const slotName = getUniqueName('non-existent-slot-all');

    expect(() => detachAll(slotName)).not.toThrow();
  });

  it('should handle detaching all from an empty slot', () => {
    const slotName = getUniqueName('test-slot-empty');

    attach(slotName, 'some-extension');
    detachAll(slotName);
    detachAll(slotName);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].attachedIds).toEqual([]);
  });

  it('should not modify state when detaching all from non-existent slot', () => {
    const slotName = getUniqueName('non-existent-all');
    const store = getExtensionInternalStore();
    const stateBefore = store.getState();

    detachAll(slotName);

    const stateAfter = store.getState();
    expect(stateAfter).toBe(stateBefore);
  });
});

describe('registerExtensionSlot', () => {
  it('should not crash when a slot is registered before the extensions that go in it', () => {
    const slotName = getUniqueName('mario-slot');

    attach(slotName, 'mario-hat');
    expect(() => registerExtensionSlot('mario-module', slotName)).not.toThrow();
  });

  it('should register a slot with module name', () => {
    const slotName = getUniqueName('slot-with-module');
    const moduleName = 'test-module';

    registerExtensionSlot(moduleName, slotName);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName]).toBeDefined();
    expect(state.slots[slotName].moduleName).toBe(moduleName);
  });

  it('should register a slot with custom state', () => {
    const slotName = getUniqueName('slot-with-state');
    const customState = { foo: 'bar', count: 42 };

    registerExtensionSlot('test-module', slotName, customState);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].state).toEqual(customState);
  });

  it('should preserve attachedIds when registering an existing slot', () => {
    const slotName = getUniqueName('preserve-attached');
    const extensionId = 'test-extension';

    attach(slotName, extensionId);
    registerExtensionSlot('test-module', slotName);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].attachedIds).toContain(extensionId);
  });
});

describe('updateExtensionSlotState', () => {
  it('should update the full state when partial is false', () => {
    const slotName = getUniqueName('test-slot-state');

    registerExtensionSlot('test-module', slotName, { initial: 'state' });

    const newState = { updated: 'state', count: 1 };
    updateExtensionSlotState(slotName, newState, false);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].state).toEqual(newState);
    expect(state.slots[slotName].state).not.toHaveProperty('initial');
  });

  it('should merge state when partial is true', () => {
    const slotName = getUniqueName('test-slot-partial');

    registerExtensionSlot('test-module', slotName, { foo: 'bar', count: 1 });

    const partialState = { count: 2, newProp: 'value' };
    updateExtensionSlotState(slotName, partialState, true);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].state).toEqual({
      foo: 'bar',
      count: 2,
      newProp: 'value',
    });
  });

  it('should default partial to false when not specified', () => {
    const slotName = getUniqueName('test-slot-default');

    registerExtensionSlot('test-module', slotName, { foo: 'bar' });

    const newState = { new: 'state' };
    updateExtensionSlotState(slotName, newState);

    const store = getExtensionInternalStore();
    const state = store.getState();

    expect(state.slots[slotName].state).toEqual(newState);
    expect(state.slots[slotName].state).not.toHaveProperty('foo');
  });
});

describe('getAssignedExtensions', () => {
  it('should return an empty array for a slot with no registered extensions', () => {
    const slotName = getUniqueName('empty-slot');

    attach(slotName, 'non-registered-extension');

    const result = getAssignedExtensions(slotName);
    expect(result).toEqual([]);
  });

  it('should return assigned extensions for a slot with registered extensions', () => {
    const slotName = getUniqueName('slot-with-extensions');
    const extensionName = getUniqueName('extension');

    const mockExtension = createMockExtension(extensionName);
    registerExtension(mockExtension);
    attach(slotName, extensionName);

    const result = getAssignedExtensions(slotName);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(extensionName);
    expect(result[0].id).toBe(extensionName);
  });

  it('should return empty array for slot with no attached extensions', () => {
    const slotName = getUniqueName('empty-registered-slot');

    registerExtensionSlot('test-module', slotName);

    const result = getAssignedExtensions(slotName);
    expect(result).toEqual([]);
  });

  it('should include extension metadata', () => {
    const slotName = getUniqueName('slot-with-meta');
    const extensionName = getUniqueName('extension-meta');
    const meta = { version: '1.0', author: 'test' };

    const mockExtension = createMockExtension(extensionName, { meta });
    registerExtension(mockExtension);
    attach(slotName, extensionName);

    const result = getAssignedExtensions(slotName);

    expect(result[0].meta).toEqual(meta);
  });
});

describe('getAssignedExtensions — display condition evaluation', () => {
  // Helper to set up the mock session store with a user session
  function setSessionWithUser(overrides: Record<string, any> = {}) {
    (sessionStore as any).setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: 'test-session',
        user: {
          uuid: 'user-uuid',
          display: 'Test User',
          username: 'testuser',
          systemId: 'testuser',
          userProperties: null,
          person: { uuid: 'person-uuid' } as any,
          privileges: [{ uuid: 'priv-1', name: 'Some Privilege', display: 'Some Privilege' }],
          roles: [{ uuid: 'role-1', name: 'Nurse', display: 'Nurse' }],
          retired: false,
          locale: 'en',
          allowedLocales: ['en'],
          ...overrides,
        },
      } as Session,
    });
  }

  // Helper to set up a session with no user (not logged in)
  function clearSession() {
    (sessionStore as any).setState({
      loaded: true,
      session: {
        authenticated: false,
        sessionId: 'test-session',
      } as Session,
    });
  }

  // Group A: Privilege Checks

  describe('privilege checks', () => {
    it('should include extension when no privileges required', () => {
      const slotName = getUniqueName('priv-slot-none');
      const extensionName = getUniqueName('priv-ext-none');

      const mockExtension = createMockExtension(extensionName);
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });

    it('should include extension when user has required privilege', () => {
      const slotName = getUniqueName('priv-slot-has');
      const extensionName = getUniqueName('priv-ext-has');

      setSessionWithUser({
        privileges: [{ uuid: 'priv-1', name: 'Some Privilege', display: 'Some Privilege' }],
        roles: [{ uuid: 'role-1', name: 'Nurse', display: 'Nurse' }],
      });
      vi.mocked(userHasAccess).mockReturnValue(true);

      const mockExtension = createMockExtension(extensionName, {
        privileges: ['Some Privilege'],
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });

    it('should exclude extension when user lacks required privilege', () => {
      const slotName = getUniqueName('priv-slot-lacks');
      const extensionName = getUniqueName('priv-ext-lacks');

      setSessionWithUser({
        privileges: [{ uuid: 'priv-2', name: 'Other Privilege', display: 'Other Privilege' }],
        roles: [{ uuid: 'role-1', name: 'Nurse', display: 'Nurse' }],
      });
      vi.mocked(userHasAccess).mockReturnValue(false);

      const mockExtension = createMockExtension(extensionName, {
        privileges: ['Some Privilege'],
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(0);
    });

    it('should include extension for System Developer regardless of privileges', () => {
      const slotName = getUniqueName('priv-slot-sysdev');
      const extensionName = getUniqueName('priv-ext-sysdev');

      setSessionWithUser({
        privileges: [],
        roles: [{ uuid: 'role-sd', name: 'System Developer', display: 'System Developer' }],
      });
      // userHasAccess returns true for System Developer (matches real behavior)
      vi.mocked(userHasAccess).mockReturnValue(true);

      const mockExtension = createMockExtension(extensionName, {
        privileges: ['Some Privilege'],
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });
  });

  // Group B: Display Expression Checks

  describe('display expression checks', () => {
    it('should include extension when no displayExpression set', () => {
      const slotName = getUniqueName('expr-slot-none');
      const extensionName = getUniqueName('expr-ext-none');

      vi.mocked(userHasAccess).mockReturnValue(true);

      const mockExtension = createMockExtension(extensionName);
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });

    it('should include extension when displayExpression evaluates to true', () => {
      const slotName = getUniqueName('expr-slot-true');
      const extensionName = getUniqueName('expr-ext-true');

      setSessionWithUser();
      vi.mocked(userHasAccess).mockReturnValue(true);

      const mockExtension = createMockExtension(extensionName, {
        displayExpression: 'true',
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });

    it('should exclude extension when displayExpression evaluates to false', () => {
      const slotName = getUniqueName('expr-slot-false');
      const extensionName = getUniqueName('expr-ext-false');

      setSessionWithUser();
      vi.mocked(userHasAccess).mockReturnValue(true);

      const mockExtension = createMockExtension(extensionName, {
        displayExpression: 'false',
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(0);
    });

    it('should evaluate displayExpression with session context', () => {
      const slotName = getUniqueName('expr-slot-session');
      const extensionName = getUniqueName('expr-ext-session');

      setSessionWithUser();
      vi.mocked(userHasAccess).mockReturnValue(true);

      const mockExtension = createMockExtension(extensionName, {
        displayExpression: 'session.authenticated === true',
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });

    it('should exclude extension and log error when displayExpression is malformed', () => {
      const slotName = getUniqueName('expr-slot-malformed');
      const extensionName = getUniqueName('expr-ext-malformed');

      setSessionWithUser();
      vi.mocked(userHasAccess).mockReturnValue(true);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockExtension = createMockExtension(extensionName, {
        displayExpression: ')(invalid javascript',
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error while evaluating expression'),
        expect.anything(),
      );

      consoleSpy.mockRestore();
    });
  });

  // Group C: Feature Flag Checks

  describe('feature flag checks', () => {
    it('should include extension when no featureFlag required', () => {
      const slotName = getUniqueName('ff-slot-none');
      const extensionName = getUniqueName('ff-ext-none');

      vi.mocked(userHasAccess).mockReturnValue(true);

      const mockExtension = createMockExtension(extensionName);
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });

    it('should include extension when required featureFlag is enabled', () => {
      const slotName = getUniqueName('ff-slot-enabled');
      const extensionName = getUniqueName('ff-ext-enabled');
      const flagName = getUniqueName('my-feature');

      vi.mocked(userHasAccess).mockReturnValue(true);

      registerFeatureFlag(flagName, 'My Feature', 'A test feature flag');
      setFeatureFlag(flagName, true);

      const mockExtension = createMockExtension(extensionName, {
        featureFlag: flagName,
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });

    it('should exclude extension when required featureFlag is disabled', () => {
      const slotName = getUniqueName('ff-slot-disabled');
      const extensionName = getUniqueName('ff-ext-disabled');
      const flagName = getUniqueName('disabled-feature');

      vi.mocked(userHasAccess).mockReturnValue(true);

      registerFeatureFlag(flagName, 'Disabled Feature', 'A disabled feature flag');
      setFeatureFlag(flagName, false);

      const mockExtension = createMockExtension(extensionName, {
        featureFlag: flagName,
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(0);
    });
  });

  // Group D: Combined Conditions

  describe('combined conditions', () => {
    it('should include extension when all conditions pass', () => {
      const slotName = getUniqueName('combined-slot-pass');
      const extensionName = getUniqueName('combined-ext-pass');
      const flagName = getUniqueName('combined-feature');

      setSessionWithUser({
        privileges: [{ uuid: 'priv-1', name: 'Some Privilege', display: 'Some Privilege' }],
        roles: [{ uuid: 'role-1', name: 'Nurse', display: 'Nurse' }],
      });
      vi.mocked(userHasAccess).mockReturnValue(true);

      registerFeatureFlag(flagName, 'Combined Feature', 'A feature flag for combined test');
      setFeatureFlag(flagName, true);

      const mockExtension = createMockExtension(extensionName, {
        privileges: ['Some Privilege'],
        displayExpression: 'true',
        featureFlag: flagName,
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(extensionName);
    });

    it('should exclude extension when any condition fails', () => {
      const slotName = getUniqueName('combined-slot-fail');
      const extensionName = getUniqueName('combined-ext-fail');

      setSessionWithUser({
        privileges: [{ uuid: 'priv-2', name: 'Other Privilege', display: 'Other Privilege' }],
        roles: [{ uuid: 'role-1', name: 'Nurse', display: 'Nurse' }],
      });
      // Privilege check fails
      vi.mocked(userHasAccess).mockReturnValue(false);

      const mockExtension = createMockExtension(extensionName, {
        privileges: ['Some Privilege'],
        displayExpression: 'true',
      });
      registerExtension(mockExtension);
      attach(slotName, extensionName);

      const result = getAssignedExtensions(slotName);

      expect(result).toHaveLength(0);
    });
  });
});
