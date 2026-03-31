import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createGlobalStore } from '@openmrs/esm-state';
import { type Session, sessionStore, userHasAccess } from '@openmrs/esm-api';
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

let nameCounter = 0;
function getUniqueName(prefix: string = 'test'): string {
  return `${prefix}-${++nameCounter}`;
}

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

type RoleEntry = { uuid: string; name: string; display: string };
type PrivilegeEntry = { uuid: string; name: string; display: string };

function setSession(
  roles: Array<RoleEntry> = [],
  privileges: Array<PrivilegeEntry> = [],
  allRoles: Array<RoleEntry> = []
) {
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
        privileges,
        roles,
        allRoles,
        retired: false,
        locale: 'en',
        allowedLocales: ['en'],
      },
    } as Session,
  });
}

function setupRegisteredExtension(slotName: string, extensionName: string, overrides?: Partial<ExtensionRegistration>) {
  const mockExtension = createMockExtension(extensionName, overrides);
  registerExtension(mockExtension);
  attach(slotName, extensionName);
  return getAssignedExtensions(slotName);
}

function getSlotState(slotName: string) {
  return getExtensionInternalStore().getState().slots[slotName];
}

/**
 * Asserts that an extension with the given displayExpression is shown or hidden
 * based on the current session state.
 */
function assertDisplayExpression(
  displayExpression: string,
  roles: Array<RoleEntry>,
  privileges: Array<PrivilegeEntry>,
  expectVisible: boolean,
) {
  const slotName = getUniqueName('expr-slot');
  const extensionName = getUniqueName('expr-ext');

  setSession(roles, privileges);
  vi.mocked(userHasAccess).mockReturnValue(true);

  const result = setupRegisteredExtension(slotName, extensionName, { displayExpression });

  if (expectVisible) {
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(extensionName);
  } else {
    expect(result).toHaveLength(0);
  }
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
      extensions: { 'test-extension': mockExtension },
    };
    expect(getExtensionRegistrationFrom(state, 'test-extension')).toBe(mockExtension);
  });

  it('should return undefined if the extension does not exist', () => {
    const state: ExtensionInternalStore = { slots: {}, extensions: {} };
    expect(getExtensionRegistrationFrom(state, 'non-existent')).toBeUndefined();
  });

  it('should handle extension IDs with # separator', () => {
    const mockExtension = createMockExtension('test-extension');
    const state: ExtensionInternalStore = {
      slots: {},
      extensions: { 'test-extension': mockExtension },
    };
    expect(getExtensionRegistrationFrom(state, 'test-extension#instance1')).toBe(mockExtension);
  });
});

describe('getExtensionRegistration', () => {
  it('should return undefined for non-existent extension', () => {
    expect(getExtensionRegistration('non-existent-extension-xyz')).toBeUndefined();
  });

  it('should return the extension registration for a registered extension', () => {
    const extensionName = getUniqueName('registered-extension');
    registerExtension(createMockExtension(extensionName));
    expect(getExtensionRegistration(extensionName)?.name).toBe(extensionName);
  });

  it('should handle extension IDs with # separator', () => {
    const extensionName = getUniqueName('extension-with-hash');
    registerExtension(createMockExtension(extensionName));
    expect(getExtensionRegistration(`${extensionName}#instance1`)?.name).toBe(extensionName);
  });
});

describe('attach', () => {
  it('should attach an extension to a non-existent slot', () => {
    const slotName = getUniqueName('test-slot');
    attach(slotName, 'test-extension');
    expect(getSlotState(slotName).attachedIds).toContain('test-extension');
  });

  it('should attach an extension to an existing slot', () => {
    const slotName = getUniqueName('test-slot-existing');
    attach(slotName, 'extension-1');
    attach(slotName, 'extension-2');
    const { attachedIds } = getSlotState(slotName);
    expect(attachedIds).toContain('extension-1');
    expect(attachedIds).toContain('extension-2');
  });

  it('should allow attaching the same extension multiple times', () => {
    const slotName = getUniqueName('test-slot-duplicate');
    attach(slotName, 'duplicate-extension');
    attach(slotName, 'duplicate-extension');
    const count = getSlotState(slotName).attachedIds.filter((id) => id === 'duplicate-extension').length;
    expect(count).toBe(2);
  });

  it('should handle extension IDs with # separator', () => {
    const slotName = getUniqueName('test-slot-with-hash');
    attach(slotName, 'extension#instance1');
    expect(getSlotState(slotName).attachedIds).toContain('extension#instance1');
  });

  it('should create a slot with the correct initial structure', () => {
    const slotName = getUniqueName('test-slot-structure');
    attach(slotName, 'test-extension');
    expect(getSlotState(slotName)).toEqual({
      moduleName: undefined,
      name: slotName,
      attachedIds: ['test-extension'],
      config: null,
      state: undefined,
    });
  });
});

describe('detach', () => {
  it('should detach an extension from a slot', () => {
    const slotName = getUniqueName('test-slot-detach');
    attach(slotName, 'extension-to-detach');
    detach(slotName, 'extension-to-detach');
    expect(getSlotState(slotName).attachedIds).not.toContain('extension-to-detach');
  });

  it('should not throw when detaching from a non-existent slot', () => {
    expect(() => detach(getUniqueName('non-existent-slot'), 'some-extension')).not.toThrow();
  });

  it('should not throw when detaching a non-attached extension', () => {
    const slotName = getUniqueName('test-slot-no-ext');
    attach(slotName, 'other-extension');
    expect(() => detach(slotName, 'non-attached-extension')).not.toThrow();
  });

  it('should only detach the specified extension', () => {
    const slotName = getUniqueName('test-slot-multi');
    attach(slotName, 'extension-1');
    attach(slotName, 'extension-2');
    detach(slotName, 'extension-1');
    const { attachedIds } = getSlotState(slotName);
    expect(attachedIds).not.toContain('extension-1');
    expect(attachedIds).toContain('extension-2');
  });

  it('should not modify state when detaching from non-existent slot', () => {
    const store = getExtensionInternalStore();
    const stateBefore = store.getState();
    detach(getUniqueName('non-existent-detach'), 'some-extension');
    expect(store.getState()).toBe(stateBefore);
  });

  it('should not modify state when detaching non-attached extension', () => {
    const slotName = getUniqueName('detach-non-attached');
    attach(slotName, 'existing-extension');
    const store = getExtensionInternalStore();
    const stateBefore = store.getState();
    detach(slotName, 'non-existent-extension');
    expect(store.getState()).toBe(stateBefore);
  });
});

describe('detachAll', () => {
  it('should detach all extensions from a slot', () => {
    const slotName = getUniqueName('test-slot-detach-all');
    attach(slotName, 'extension-1');
    attach(slotName, 'extension-2');
    attach(slotName, 'extension-3');
    detachAll(slotName);
    expect(getSlotState(slotName).attachedIds).toEqual([]);
  });

  it('should not throw when detaching all from a non-existent slot', () => {
    expect(() => detachAll(getUniqueName('non-existent-slot-all'))).not.toThrow();
  });

  it('should handle detaching all from an empty slot', () => {
    const slotName = getUniqueName('test-slot-empty');
    attach(slotName, 'some-extension');
    detachAll(slotName);
    detachAll(slotName);
    expect(getSlotState(slotName).attachedIds).toEqual([]);
  });

  it('should not modify state when detaching all from non-existent slot', () => {
    const store = getExtensionInternalStore();
    const stateBefore = store.getState();
    detachAll(getUniqueName('non-existent-all'));
    expect(store.getState()).toBe(stateBefore);
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
    registerExtensionSlot('test-module', slotName);
    expect(getSlotState(slotName)?.moduleName).toBe('test-module');
  });

  it('should register a slot with custom state', () => {
    const slotName = getUniqueName('slot-with-state');
    const customState = { foo: 'bar', count: 42 };
    registerExtensionSlot('test-module', slotName, customState);
    expect(getSlotState(slotName).state).toEqual(customState);
  });

  it('should preserve attachedIds when registering an existing slot', () => {
    const slotName = getUniqueName('preserve-attached');
    attach(slotName, 'test-extension');
    registerExtensionSlot('test-module', slotName);
    expect(getSlotState(slotName).attachedIds).toContain('test-extension');
  });
});

describe('updateExtensionSlotState', () => {
  it('should update the full state when partial is false', () => {
    const slotName = getUniqueName('test-slot-state');
    registerExtensionSlot('test-module', slotName, { initial: 'state' });
    const newState = { updated: 'state', count: 1 };
    updateExtensionSlotState(slotName, newState, false);
    const state = getSlotState(slotName).state;
    expect(state).toEqual(newState);
    expect(state).not.toHaveProperty('initial');
  });

  it('should merge state when partial is true', () => {
    const slotName = getUniqueName('test-slot-partial');
    registerExtensionSlot('test-module', slotName, { foo: 'bar', count: 1 });
    updateExtensionSlotState(slotName, { count: 2, newProp: 'value' }, true);
    expect(getSlotState(slotName).state).toEqual({ foo: 'bar', count: 2, newProp: 'value' });
  });

  it('should default partial to false when not specified', () => {
    const slotName = getUniqueName('test-slot-default');
    registerExtensionSlot('test-module', slotName, { foo: 'bar' });
    updateExtensionSlotState(slotName, { new: 'state' });
    const state = getSlotState(slotName).state;
    expect(state).toEqual({ new: 'state' });
    expect(state).not.toHaveProperty('foo');
  });
});

describe('getAssignedExtensions', () => {
  it('should return an empty array for a slot with no registered extensions', () => {
    const slotName = getUniqueName('empty-slot');
    attach(slotName, 'non-registered-extension');
    expect(getAssignedExtensions(slotName)).toEqual([]);
  });

  it('should return assigned extensions for a slot with registered extensions', () => {
    const slotName = getUniqueName('slot-with-extensions');
    const extensionName = getUniqueName('extension');
    const result = setupRegisteredExtension(slotName, extensionName);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(extensionName);
    expect(result[0].id).toBe(extensionName);
  });

  it('should return empty array for slot with no attached extensions', () => {
    const slotName = getUniqueName('empty-registered-slot');
    registerExtensionSlot('test-module', slotName);
    expect(getAssignedExtensions(slotName)).toEqual([]);
  });

  it('should include extension metadata', () => {
    const slotName = getUniqueName('slot-with-meta');
    const extensionName = getUniqueName('extension-meta');
    const meta = { version: '1.0', author: 'test' };
    const result = setupRegisteredExtension(slotName, extensionName, { meta });
    expect(result[0].meta).toEqual(meta);
  });
});

describe('getAssignedExtensions — hasRole and hasPrivilege helpers', () => {
  const nurse: RoleEntry = { uuid: 'role-1', name: 'Nurse', display: 'Nurse' };
  const editOrders: PrivilegeEntry = { uuid: 'priv-1', name: 'Edit Orders', display: 'Edit Orders' };
  const viewReports: PrivilegeEntry = { uuid: 'priv-2', name: 'View Reports', display: 'View Reports' };

  describe('hasRole() helper', () => {
    it('should show extension when hasRole matches user role', () => {
      assertDisplayExpression("hasRole('Nurse')", [nurse], [], true);
    });

    it('should hide extension when hasRole does not match user role', () => {
      assertDisplayExpression("hasRole('Doctor')", [nurse], [], false);
    });

    it('should check inherited roles via allRoles', () => {
      assertDisplayExpression(
        "hasRole('Nurse')",
        [],
        [],
        true
      );
    });

    it('should support OR logic across multiple roles', () => {
      assertDisplayExpression("hasRole('Doctor') || hasRole('Nurse')", [nurse], [], true);
    });
  });

  describe('hasPrivilege() helper', () => {
    it('should show extension when hasPrivilege matches user privilege', () => {
      assertDisplayExpression("hasPrivilege('Edit Orders')", [], [editOrders], true);
    });

    it('should hide extension when hasPrivilege does not match', () => {
      assertDisplayExpression("hasPrivilege('Edit Orders')", [], [viewReports], false);
    });

    it('should return false gracefully when user has no privileges', () => {
      assertDisplayExpression("hasPrivilege('Edit Orders')", [], [], false);
    });
  });
});
