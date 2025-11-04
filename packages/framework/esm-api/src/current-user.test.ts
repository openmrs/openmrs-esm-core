import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Observable } from 'rxjs';
import {
  userHasAccess,
  getCurrentUser,
  refetchCurrentUser,
  clearCurrentUser,
  getLoggedInUser,
  setUserLanguage,
  setSessionLocation,
  setUserProperties,
  sessionStore,
} from './current-user';
import type * as openmrsFetchExport from './openmrs-fetch';
import { openmrsFetch } from './openmrs-fetch';
import { reportError } from '@openmrs/esm-error-handling';
import type { LoggedInUser, Privilege, Role, Session } from './types';

// Mock only the function calls, not constants
vi.mock('./openmrs-fetch', async () => {
  const actual = await vi.importActual<typeof openmrsFetchExport>('./openmrs-fetch');
  return {
    ...actual,
    openmrsFetch: vi.fn(),
  };
});

vi.mock('@openmrs/esm-error-handling', () => ({
  reportError: vi.fn(),
}));

const mockOpenmrsFetch = vi.mocked(openmrsFetch);
const mockReportError = vi.mocked(reportError);

// Helper to create mock fetch responses
function createMockFetchResponse<T>(data: T, ok = true): any {
  return {
    data,
    ok,
    status: ok ? 200 : 400,
    statusText: ok ? 'OK' : 'Bad Request',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as const,
    url: '',
    clone: vi.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: vi.fn(),
    blob: vi.fn(),
    formData: vi.fn(),
    json: vi.fn(),
    text: vi.fn(),
  };
}

describe('userHasAccess', () => {
  const createPrivilege = (display: string): Privilege => ({
    uuid: `${display}-uuid`,
    display,
    name: display,
  });

  const createRole = (display: string): Role => ({
    uuid: `${display}-uuid`,
    display,
    name: display,
  });

  const mockUser = {
    privileges: [
      createPrivilege('View Patients'),
      createPrivilege('Edit Patients'),
      createPrivilege('Delete Patients'),
    ],
    roles: [createRole('Clinician')],
  };

  const mockSuperUser = {
    privileges: [createPrivilege('View Patients')],
    roles: [createRole('System Developer')],
  };

  it('should return true when user has the required privilege', () => {
    expect(userHasAccess('View Patients', mockUser)).toBe(true);
  });

  it('should return false when user lacks the required privilege', () => {
    expect(userHasAccess('Manage Users', mockUser)).toBe(false);
  });

  it('should handle array of privileges (user needs ALL)', () => {
    expect(userHasAccess(['View Patients', 'Edit Patients'], mockUser)).toBe(true);
  });

  it('should return false when user lacks one of multiple required privileges', () => {
    expect(userHasAccess(['View Patients', 'Manage Users'], mockUser)).toBe(false);
  });

  it('should return true when user is undefined and no privilege is required', () => {
    // @ts-expect-error Testing with undefined user
    expect(userHasAccess(undefined, undefined)).toBe(true);
  });

  it('should return false when user is undefined and privilege is required', () => {
    // @ts-expect-error Testing with undefined user
    const result = userHasAccess('View Patients', undefined);
    expect(result).toBe(false);
  });

  it('should return true when no privilege is required and user exists', () => {
    expect(userHasAccess('', mockUser)).toBe(true);
  });

  it('should return true for super users regardless of privileges', () => {
    expect(userHasAccess('Manage Users', mockSuperUser)).toBe(true);
  });

  it('should be case-sensitive for privilege names', () => {
    expect(userHasAccess('view patients', mockUser)).toBe(false);
  });

  it('should handle empty privilege array', () => {
    expect(userHasAccess([], mockUser)).toBe(true);
  });

  it('should return true when single privilege in array matches', () => {
    expect(userHasAccess(['View Patients'], mockUser)).toBe(true);
  });

  it('should return false when user has no privileges', () => {
    const userWithNoPrivileges = { privileges: [], roles: [] };
    const result = userHasAccess('View Patients', userWithNoPrivileges);
    expect(result).toBe(false);
  });
});

describe('clearCurrentUser', () => {
  it('should clear the session store', () => {
    clearCurrentUser();
    const state = sessionStore.getState();
    expect(state.loaded).toBe(true);
    expect(state.session?.authenticated).toBe(false);
    expect(state.session?.sessionId).toBe('');
  });
});

describe('setUserLanguage', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('lang');
  });

  it('should set document language from session locale', () => {
    const session: Session = {
      authenticated: true,
      sessionId: 'test-session',
      locale: 'en-US',
      user: {} as LoggedInUser,
    };

    setUserLanguage(session);
    expect(document.documentElement).toHaveAttribute('lang', 'en-US');
  });

  it('should set document language from user properties defaultLocale', () => {
    const session: Session = {
      authenticated: true,
      sessionId: 'test-session',
      user: {
        userProperties: {
          defaultLocale: 'fr-FR',
        },
      } as unknown as LoggedInUser,
    };

    setUserLanguage(session);
    expect(document.documentElement).toHaveAttribute('lang', 'fr-FR');
  });

  it('should prefer session locale over user properties', () => {
    const session: Session = {
      authenticated: true,
      sessionId: 'test-session',
      locale: 'es-ES',
      user: {
        userProperties: {
          defaultLocale: 'fr-FR',
        },
      } as unknown as LoggedInUser,
    };

    setUserLanguage(session);
    expect(document.documentElement).toHaveAttribute('lang', 'es-ES');
  });

  it('should convert underscores to hyphens in locale', () => {
    const session: Session = {
      authenticated: true,
      sessionId: 'test-session',
      locale: 'en_US',
      user: {} as LoggedInUser,
    };

    setUserLanguage(session);
    expect(document.documentElement).toHaveAttribute('lang', 'en-US');
  });

  it('should not set language if locale is invalid', () => {
    const session: Session = {
      authenticated: true,
      sessionId: 'test-session',
      locale: 'invalid-locale-xyz',
      user: {} as LoggedInUser,
    };

    setUserLanguage(session);
    expect(document.documentElement).not.toHaveAttribute('lang');
  });

  it('should not set language if locale is undefined', () => {
    const session: Session = {
      authenticated: true,
      sessionId: 'test-session',
      user: {} as LoggedInUser,
    };

    setUserLanguage(session);
    expect(document.documentElement).not.toHaveAttribute('lang');
  });

  it('should not update if language is already set to the same value', () => {
    document.documentElement.setAttribute('lang', 'en-US');
    const session: Session = {
      authenticated: true,
      sessionId: 'test-session',
      locale: 'en-US',
      user: {} as LoggedInUser,
    };

    const spy = vi.spyOn(document.documentElement, 'setAttribute');
    setUserLanguage(session);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('getLoggedInUser', () => {
  beforeEach(() => {
    // Reset session store
    sessionStore.setState({ loaded: false, session: null });
  });

  it('should return logged in user when session is loaded', async () => {
    const mockUser: LoggedInUser = {
      uuid: 'user-uuid',
      display: 'Test User',
      username: 'testuser',
      systemId: 'test-sys-id',
      userProperties: {},
      person: {} as any,
      privileges: [],
      roles: [],
      retired: false,
      locale: 'en',
      allowedLocales: ['en'],
    };

    sessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: 'test-session',
        user: mockUser,
      },
    });

    const user = await getLoggedInUser();
    expect(user).toEqual(mockUser);
  });

  it('should wait for session to load if not already loaded', async () => {
    const mockUser: LoggedInUser = {
      uuid: 'user-uuid',
      display: 'Test User',
      username: 'testuser',
      systemId: 'test-sys-id',
      userProperties: {},
      person: {} as any,
      privileges: [],
      roles: [],
      retired: false,
      locale: 'en',
      allowedLocales: ['en'],
    };

    const promise = getLoggedInUser();

    // Simulate session loading after a delay
    setTimeout(() => {
      sessionStore.setState({
        loaded: true,
        session: {
          authenticated: true,
          sessionId: 'test-session',
          user: mockUser,
        },
      });
    }, 10);

    const user = await promise;
    expect(user).toEqual(mockUser);
  });
});

describe('getCurrentUser', () => {
  let subscriptions: Array<{ unsubscribe?: () => void }> = [];

  beforeEach(() => {
    sessionStore.setState({ loaded: false, session: null });
    mockOpenmrsFetch.mockClear();
    // Mock openmrsFetch to prevent unhandled promise rejections
    mockOpenmrsFetch.mockResolvedValue(
      createMockFetchResponse({
        authenticated: false,
        sessionId: '',
      }),
    );
  });

  afterEach(() => {
    // Clean up any active subscriptions
    subscriptions.forEach((sub) => sub.unsubscribe?.());
    subscriptions = [];
  });

  it('should return an Observable', () => {
    const result = getCurrentUser();
    expect(result).toBeInstanceOf(Observable);
  });

  it('should emit user when session is loaded and includeAuthStatus is false', () => {
    return new Promise<void>((resolve) => {
      const mockUser: LoggedInUser = {
        uuid: 'user-uuid',
        display: 'Test User',
        username: 'testuser',
        systemId: 'test-sys-id',
        userProperties: {},
        person: {} as any,
        privileges: [],
        roles: [],
        retired: false,
        locale: 'en',
        allowedLocales: ['en'],
      };

      sessionStore.setState({
        loaded: true,
        session: {
          authenticated: true,
          sessionId: 'test-session',
          user: mockUser,
        },
      });

      const sub = getCurrentUser({ includeAuthStatus: false }).subscribe((user) => {
        expect(user).toEqual(mockUser);
        resolve();
      });
      subscriptions.push(sub);
    });
  });

  it('should emit full session when includeAuthStatus is true', () => {
    return new Promise<void>((resolve) => {
      const mockUser: LoggedInUser = {
        uuid: 'user-uuid',
        display: 'Test User',
        username: 'testuser',
        systemId: 'test-sys-id',
        userProperties: {},
        person: {} as any,
        privileges: [],
        roles: [],
        retired: false,
        locale: 'en',
        allowedLocales: ['en'],
      };

      const mockSession: Session = {
        authenticated: true,
        sessionId: 'test-session',
        user: mockUser,
      };

      sessionStore.setState({
        loaded: true,
        session: mockSession,
      });

      const sub = getCurrentUser({ includeAuthStatus: true }).subscribe((session) => {
        expect(session).toEqual(mockSession);
        resolve();
      });
      subscriptions.push(sub);
    });
  });

  it('should not emit when session is not loaded', () => {
    const handler = vi.fn();
    const sub = getCurrentUser({ includeAuthStatus: false }).subscribe(handler);
    subscriptions.push(sub);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should emit updates when session changes', () => {
    return new Promise<void>((resolve) => {
      const mockUser1: LoggedInUser = {
        uuid: 'user-1',
        display: 'User 1',
        username: 'user1',
        systemId: 'sys-1',
        userProperties: {},
        person: {} as any,
        privileges: [],
        roles: [],
        retired: false,
        locale: 'en',
        allowedLocales: ['en'],
      };

      const mockUser2: LoggedInUser = {
        uuid: 'user-2',
        display: 'User 2',
        username: 'user2',
        systemId: 'sys-2',
        userProperties: {},
        person: {} as any,
        privileges: [],
        roles: [],
        retired: false,
        locale: 'en',
        allowedLocales: ['en'],
      };

      const emittedUsers: LoggedInUser[] = [];

      sessionStore.setState({
        loaded: true,
        session: {
          authenticated: true,
          sessionId: 'session-1',
          user: mockUser1,
        },
      });

      const sub = getCurrentUser({ includeAuthStatus: false }).subscribe((user) => {
        emittedUsers.push(user);
        if (emittedUsers.length === 2) {
          expect(emittedUsers[0]).toEqual(mockUser1);
          expect(emittedUsers[1]).toEqual(mockUser2);
          resolve();
        }
      });
      subscriptions.push(sub);

      setTimeout(() => {
        sessionStore.setState({
          loaded: true,
          session: {
            authenticated: true,
            sessionId: 'session-2',
            user: mockUser2,
          },
        });
      }, 10);
    });
  });

  it('should allow unsubscribing', () => {
    const handler = vi.fn();
    const subscription = getCurrentUser({ includeAuthStatus: false }).subscribe(handler);
    subscriptions.push(subscription);

    sessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: 'test-session',
        user: {} as LoggedInUser,
      },
    });

    handler.mockClear();
    subscription.unsubscribe();

    sessionStore.setState({
      loaded: true,
      session: {
        authenticated: false,
        sessionId: 'new-session',
      },
    });

    expect(handler).not.toHaveBeenCalled();
  });
});

describe('refetchCurrentUser', () => {
  beforeEach(() => {
    sessionStore.setState({ loaded: false, session: null });
    mockOpenmrsFetch.mockClear();
  });

  it('should fetch user without credentials', async () => {
    const mockSession: Session = {
      authenticated: true,
      sessionId: 'test-session',
      user: {} as LoggedInUser,
    };

    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(mockSession));

    await refetchCurrentUser();

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining('/session'),
      expect.objectContaining({
        headers: {},
      }),
    );
  });

  it('should use Basic Auth when username and password are provided', async () => {
    const mockSession: Session = {
      authenticated: true,
      sessionId: 'test-session',
      user: {} as LoggedInUser,
    };

    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(mockSession));

    await refetchCurrentUser('testuser', 'testpass');

    const expectedAuth = `Basic ${btoa('testuser:testpass')}`;
    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining('/session'),
      expect.objectContaining({
        headers: {
          Authorization: expectedAuth,
        },
      }),
    );
  });

  it('should update session store on success', async () => {
    const mockUser: LoggedInUser = {
      uuid: 'user-uuid',
      display: 'Test User',
      username: 'testuser',
      systemId: 'test-sys-id',
      userProperties: {},
      person: {} as any,
      privileges: [],
      roles: [],
      retired: false,
      locale: 'en',
      allowedLocales: ['en'],
    };

    const mockSession: Session = {
      authenticated: true,
      sessionId: 'test-session',
      user: mockUser,
    };

    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(mockSession));

    await refetchCurrentUser();

    const state = sessionStore.getState();
    expect(state.loaded).toBe(true);
    expect(state.session).toEqual(mockSession);
  });

  it('should handle fetch failure', async () => {
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));

    await expect(refetchCurrentUser()).rejects.toMatchObject({
      loaded: false,
      session: null,
    });

    expect(mockReportError).toHaveBeenCalled();
  });
});

describe('setSessionLocation', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockClear();
  });

  it('should set session location with AbortController', async () => {
    const locationUuid = 'location-uuid-123';
    const abortController = new AbortController();
    const mockSession: Session = {
      authenticated: true,
      sessionId: 'test-session',
      sessionLocation: {
        uuid: locationUuid,
      } as any,
      user: {} as LoggedInUser,
    };

    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(mockSession));

    await setSessionLocation(locationUuid, abortController);

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining('/session'),
      expect.objectContaining({
        method: 'POST',
        body: { sessionLocation: locationUuid },
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
      }),
    );
  });

  it('should update session store with new location', async () => {
    const locationUuid = 'location-uuid-123';
    const abortController = new AbortController();
    const mockSession: Session = {
      authenticated: true,
      sessionId: 'test-session',
      sessionLocation: {
        uuid: locationUuid,
        display: 'Test Location',
      } as any,
      user: {} as LoggedInUser,
    };

    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(mockSession));

    await setSessionLocation(locationUuid, abortController);

    const state = sessionStore.getState();
    expect(state.loaded).toBe(true);
    expect(state.session?.sessionLocation?.uuid).toBe(locationUuid);
  });
});

describe('setUserProperties', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockClear();
  });

  it('should set user properties and refetch session', async () => {
    const userUuid = 'user-uuid-123';
    const userProperties = {
      defaultLocale: 'en-US',
      favoriteColor: 'blue',
    };

    mockOpenmrsFetch
      .mockResolvedValueOnce(createMockFetchResponse({})) // First call to update properties
      .mockResolvedValueOnce(
        createMockFetchResponse({
          // Second call to refetch session
          authenticated: true,
          sessionId: 'test-session',
          user: {
            uuid: userUuid,
            userProperties,
          } as unknown as LoggedInUser,
        }),
      );

    await setUserProperties(userUuid, userProperties);

    expect(mockOpenmrsFetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(`/user/${userUuid}`),
      expect.objectContaining({
        method: 'POST',
        body: { userProperties },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    // Should refetch session after updating
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(2);
  });

  it('should use provided AbortController', async () => {
    const userUuid = 'user-uuid-123';
    const userProperties = { defaultLocale: 'fr-FR' };
    const abortController = new AbortController();

    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse({})).mockResolvedValueOnce(
      createMockFetchResponse({
        authenticated: true,
        sessionId: 'test-session',
        user: {} as LoggedInUser,
      }),
    );

    await setUserProperties(userUuid, userProperties, abortController);

    expect(mockOpenmrsFetch).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        signal: abortController.signal,
      }),
    );
  });

  it('should create AbortController if not provided', async () => {
    const userUuid = 'user-uuid-123';
    const userProperties = { defaultLocale: 'es-ES' };

    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse({})).mockResolvedValueOnce(
      createMockFetchResponse({
        authenticated: true,
        sessionId: 'test-session',
        user: {} as LoggedInUser,
      }),
    );

    await setUserProperties(userUuid, userProperties);

    expect(mockOpenmrsFetch).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
