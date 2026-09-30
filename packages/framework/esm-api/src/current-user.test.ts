import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
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
  setSessionLocale,
  verifyTotpCode,
  logout,
} from './current-user';
import type * as openmrsFetchExport from './openmrs-fetch';
import { OpenmrsFetchError, openmrsFetch } from './openmrs-fetch';
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

function createAuthFailure(status: number, responseBody: unknown = null) {
  return new OpenmrsFetchError('/openmrs/ws/rest/v1/session', { status } as Response, responseBody as any, Error());
}

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
    sessionStore.setState({ loaded: false, session: null }, true);
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
  beforeEach(() => {
    sessionStore.setState({ loaded: false, session: null }, true);
    mockOpenmrsFetch.mockClear();
    mockReportError.mockClear();
    // Mock openmrsFetch to prevent unhandled promise rejections
    mockOpenmrsFetch.mockResolvedValue(
      createMockFetchResponse({
        authenticated: false,
        sessionId: '',
      }),
    );
  });

  const buildMockUser = (): LoggedInUser => ({
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
  });

  it('should return a Promise', () => {
    expect(getCurrentUser()).toBeInstanceOf(Promise);
  });

  it('should resolve with the user when the session is fresh and includeAuthStatus is false', async () => {
    const mockUser = buildMockUser();
    mockOpenmrsFetch.mockResolvedValue(
      createMockFetchResponse({ authenticated: true, sessionId: 'test-session', user: mockUser }),
    );
    await refetchCurrentUser();
    mockOpenmrsFetch.mockClear();

    await expect(getCurrentUser({ includeAuthStatus: false })).resolves.toEqual(mockUser);
    expect(mockOpenmrsFetch).not.toHaveBeenCalled();
  });

  it('should resolve with the full session when includeAuthStatus is true', async () => {
    const mockSession: Session = {
      authenticated: true,
      sessionId: 'test-session',
      user: buildMockUser(),
    };
    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(mockSession));
    await refetchCurrentUser();
    mockOpenmrsFetch.mockClear();

    await expect(getCurrentUser({ includeAuthStatus: true })).resolves.toEqual(mockSession);
    expect(mockOpenmrsFetch).not.toHaveBeenCalled();
  });

  it('should refetch and resolve with the fresh session when the loaded session is stale', async () => {
    vi.useFakeTimers();

    try {
      const staleSession: Session = { authenticated: true, sessionId: 'stale-session', user: buildMockUser() };
      const freshSession: Session = { authenticated: true, sessionId: 'fresh-session', user: buildMockUser() };

      mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(staleSession));
      await refetchCurrentUser();

      vi.setSystemTime(Date.now() + 61 * 1000);
      mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(freshSession));

      await expect(getCurrentUser({ includeAuthStatus: true })).resolves.toEqual(freshSession);
    } finally {
      vi.useRealTimers();
    }
  });

  it('should wait for a refetch already in flight rather than resolving with the session it replaces', async () => {
    const oldSession: Session = { authenticated: true, sessionId: 'old-session', user: buildMockUser() };
    const newSession: Session = { authenticated: true, sessionId: 'new-session', user: buildMockUser() };

    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(oldSession));
    await refetchCurrentUser();
    mockOpenmrsFetch.mockClear();

    // The store still holds `oldSession` and its fetch timestamp is well inside the freshness window,
    // so only the in-flight refetch stops `getCurrentUser` from handing back the session on its way out.
    let resolveFetch: (response: unknown) => void;
    mockOpenmrsFetch.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    const refetch = refetchCurrentUser();

    const pending = getCurrentUser({ includeAuthStatus: true });
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(1);

    resolveFetch!(createMockFetchResponse(newSession));
    await refetch;

    await expect(pending).resolves.toEqual(newSession);
  });

  it('should share a single request between concurrent callers', async () => {
    const mockSession: Session = {
      authenticated: true,
      sessionId: 'test-session',
      user: buildMockUser(),
    };
    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(mockSession));

    await expect(Promise.all([getCurrentUser(), getCurrentUser()])).resolves.toEqual([mockSession, mockSession]);
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(1);
  });

  it('should not reject when the fetch fails, resolving once a session is loaded', async () => {
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));

    let resolvedSession: Session | undefined;
    const promise = getCurrentUser({ includeAuthStatus: true }).then((session) => {
      resolvedSession = session;
    });

    await vi.waitFor(() => expect(mockReportError).toHaveBeenCalled());
    expect(resolvedSession).toBeUndefined();

    const mockSession: Session = { authenticated: true, sessionId: 'test-session', user: buildMockUser() };
    sessionStore.setState({ loaded: true, session: mockSession });

    await promise;
    expect(resolvedSession).toEqual(mockSession);
  });

  it('should resolve with the last loaded session when a refresh fails', async () => {
    vi.useFakeTimers();

    try {
      const staleSession: Session = { authenticated: true, sessionId: 'stale-session', user: buildMockUser() };
      mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse(staleSession));
      await refetchCurrentUser();

      vi.setSystemTime(Date.now() + 61 * 1000);
      mockOpenmrsFetch.mockRejectedValue(new Error('Bad gateway'));

      await expect(getCurrentUser({ includeAuthStatus: true })).resolves.toEqual(staleSession);
    } finally {
      vi.useRealTimers();
    }
  });

  it('should not resolve until the session is loaded', async () => {
    // Prevent the automatic refetch from resolving the session so the only way
    // the promise settles is the manual store update below.
    mockOpenmrsFetch.mockReturnValue(new Promise(() => {}));
    const mockUser = buildMockUser();

    let resolvedUser: LoggedInUser | undefined;
    const promise = getCurrentUser({ includeAuthStatus: false }).then((user) => {
      resolvedUser = user as LoggedInUser;
    });

    await Promise.resolve();
    expect(resolvedUser).toBeUndefined();

    sessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: 'test-session',
        user: mockUser,
      },
    });

    await promise;
    expect(resolvedUser).toEqual(mockUser);
  });
});

describe('refetchCurrentUser', () => {
  beforeEach(() => {
    sessionStore.setState({ loaded: false, session: null }, true);
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
        rejectAuthFailure: true,
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
        rejectAuthFailure: true,
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

  it('should record the error when the fetch fails before any session has loaded', async () => {
    const error = new Error('Bad gateway');
    mockOpenmrsFetch.mockRejectedValue(error);

    await expect(refetchCurrentUser()).rejects.toEqual({ loaded: false, session: null, error, initializing: false });
    expect(sessionStore.getState()).toEqual({ loaded: false, session: null, error, initializing: false });
  });

  it('should keep an already-loaded session when a later fetch fails', async () => {
    const mockSession: Session = { authenticated: true, sessionId: 'test-session', user: {} as LoggedInUser };
    sessionStore.setState({ loaded: true, session: mockSession }, true);
    mockReportError.mockClear();
    mockOpenmrsFetch.mockRejectedValue(new Error('Bad gateway'));

    await expect(refetchCurrentUser()).rejects.toEqual({ loaded: true, session: mockSession });
    expect(sessionStore.getState()).toEqual({ loaded: true, session: mockSession });
    expect(mockReportError).toHaveBeenCalled();
  });

  it('should record an error when the session endpoint does not respond with a session', async () => {
    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse('<html>Bad gateway</html>'));

    await expect(refetchCurrentUser()).rejects.toMatchObject({ loaded: false, session: null });
    expect(sessionStore.getState()).toMatchObject({
      loaded: false,
      error: new Error('The session endpoint did not respond with a session'),
    });
    expect(sessionStore.getState()).toMatchObject({ initializing: false });
  });

  it('should record that the server is starting up when the session request is redirected to initial setup', async () => {
    mockOpenmrsFetch.mockResolvedValue({
      ...createMockFetchResponse(undefined),
      redirected: true,
      url: 'http://localhost/openmrs/initialsetup',
    });

    await expect(refetchCurrentUser()).rejects.toMatchObject({ loaded: false, session: null, initializing: true });
    expect(sessionStore.getState()).toMatchObject({
      loaded: false,
      initializing: true,
      error: new Error('The server is still starting up'),
    });
  });

  it('should use the unauthenticated session in the body of a 401 response', async () => {
    const unauthenticated = { authenticated: false, sessionId: 'abc', allowedLocales: ['en', 'fr'] };
    mockOpenmrsFetch.mockRejectedValue(createAuthFailure(401, unauthenticated));

    await expect(refetchCurrentUser()).resolves.toEqual({ loaded: true, session: unauthenticated });
  });

  it.each([401, 403])(
    'should record a logged-out session when the session endpoint responds with %i',
    async (status) => {
      mockReportError.mockClear();
      mockOpenmrsFetch.mockRejectedValue(createAuthFailure(status));

      await expect(refetchCurrentUser()).resolves.toEqual({
        loaded: true,
        session: { authenticated: false, sessionId: '' },
      });

      expect(sessionStore.getState()).toEqual({
        loaded: true,
        session: { authenticated: false, sessionId: '' },
      });
      expect(mockReportError).not.toHaveBeenCalled();
    },
  );

  it('should not leave readers waiting on the failed request after an auth failure', async () => {
    mockOpenmrsFetch.mockRejectedValueOnce(createAuthFailure(401));
    await refetchCurrentUser();

    await expect(getCurrentUser()).resolves.toEqual({ authenticated: false, sessionId: '' });
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(1);
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
        rejectAuthFailure: true,
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

    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse({}));
    mockOpenmrsFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        authenticated: true,
        sessionId: 'test-session',
        user: {
          uuid: userUuid,
          userProperties,
        } as unknown as LoggedInUser,
      }),
    );

    await setUserProperties(userUuid, userProperties);

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
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

    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse({}));
    mockOpenmrsFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        authenticated: true,
        sessionId: 'test-session',
        user: {} as LoggedInUser,
      }),
    );

    await setUserProperties(userUuid, userProperties, abortController);

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        signal: abortController.signal,
      }),
    );
  });

  it('should create AbortController if not provided', async () => {
    const userUuid = 'user-uuid-123';
    const userProperties = { defaultLocale: 'es-ES' };

    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse({}));
    mockOpenmrsFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        authenticated: true,
        sessionId: 'test-session',
        user: {} as LoggedInUser,
      }),
    );

    await setUserProperties(userUuid, userProperties);

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });
});

describe('setSessionLocale', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockClear();
  });

  it('should set the session locale and refetch the session', async () => {
    const mockSession: Session = { authenticated: true, sessionId: 'test-session', locale: 'fr' };
    const abortController = new AbortController();
    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse(mockSession));
    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse(mockSession));

    await expect(setSessionLocale('fr', abortController)).resolves.toEqual({ loaded: true, session: mockSession });

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      '/ws/rest/v1/session',
      expect.objectContaining({
        method: 'POST',
        body: { locale: 'fr' },
        signal: abortController.signal,
      }),
    );
    expect(mockOpenmrsFetch).toHaveBeenLastCalledWith(
      '/ws/rest/v1/session',
      expect.objectContaining({ rejectAuthFailure: true }),
    );
  });

  it('should reject with the fetch error when the server does not accept the locale', async () => {
    const error = new OpenmrsFetchError('/openmrs/ws/rest/v1/session', { status: 400 } as Response, null, Error());
    mockOpenmrsFetch.mockRejectedValueOnce(error);

    await expect(setSessionLocale('xx')).rejects.toBe(error);
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(1);
  });
});

describe('verifyTotpCode', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockClear();
  });

  it('should send the code and ask the server to remember the device only when requested', async () => {
    mockOpenmrsFetch.mockResolvedValue(createMockFetchResponse({ authenticated: false, sessionId: '' }));

    await verifyTotpCode('123456');
    expect(mockOpenmrsFetch).toHaveBeenLastCalledWith('/ws/rest/v1/session', {
      headers: { 'X-Totp-Code': '123456' },
    });

    await verifyTotpCode('123456', true);
    expect(mockOpenmrsFetch).toHaveBeenLastCalledWith('/ws/rest/v1/session?rememberMe=true', {
      headers: { 'X-Totp-Code': '123456' },
    });
  });

  it('should refetch and resolve with the session when the code is accepted', async () => {
    const mockSession: Session = { authenticated: true, sessionId: 'test-session', user: {} as LoggedInUser };
    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse({ authenticated: true, sessionId: 'test-session' }));
    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse(mockSession));

    await expect(verifyTotpCode('123456')).resolves.toEqual(mockSession);
    expect(sessionStore.getState()).toEqual({ loaded: true, session: mockSession });
  });

  it('should resolve with the unauthenticated session without refetching when the code is not accepted', async () => {
    const unauthenticated = { authenticated: false, sessionId: '' };
    mockOpenmrsFetch.mockResolvedValueOnce(createMockFetchResponse(unauthenticated));

    await expect(verifyTotpCode('000000')).resolves.toEqual(unauthenticated);
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(1);
  });
});

describe('logout', () => {
  const loggedOut = { loaded: true, session: { authenticated: false, sessionId: '' } };

  beforeEach(() => {
    sessionStore.setState(
      {
        loaded: true,
        session: { authenticated: true, sessionId: 'test-session', user: {} as LoggedInUser },
      },
      true,
    );
    mockOpenmrsFetch.mockReset();
  });

  it('should delete the session and record a logged-out session', async () => {
    mockOpenmrsFetch
      .mockResolvedValueOnce(createMockFetchResponse(null))
      .mockResolvedValueOnce(createMockFetchResponse({ authenticated: false, sessionId: '' }));

    await logout();

    expect(mockOpenmrsFetch).toHaveBeenNthCalledWith(1, '/ws/rest/v1/session', {
      method: 'DELETE',
      rejectAuthFailure: true,
    });
    expect(sessionStore.getState()).toEqual(loggedOut);
  });

  it('should treat a session the server has already ended as logged out', async () => {
    mockOpenmrsFetch.mockRejectedValue(createAuthFailure(401));

    await expect(logout()).resolves.toBeUndefined();
    expect(sessionStore.getState()).toEqual(loggedOut);
  });

  it('should reject and keep the session when the server fails to end it', async () => {
    const before = sessionStore.getState();
    const error = new OpenmrsFetchError('/openmrs/ws/rest/v1/session', { status: 500 } as Response, null, Error());
    mockOpenmrsFetch.mockRejectedValueOnce(error);

    await expect(logout()).rejects.toBe(error);
    expect(sessionStore.getState()).toEqual(before);
  });
});
