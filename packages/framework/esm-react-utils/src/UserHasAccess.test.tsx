import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import type { LoggedInUser, Privilege, Role } from '@openmrs/esm-api';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { getSessionStore, userHasAccess } from '@openmrs/esm-api';
import { UserHasAccess } from './UserHasAccess';

// Mock getSessionStore and userHasAccess
const mockGetSessionStore = vi.fn();
const mockUserHasAccess = vi.fn();

vi.mock('@openmrs/esm-api', () => ({
  getSessionStore: (...args: Parameters<typeof getSessionStore>) => mockGetSessionStore(...args),
  userHasAccess: (...args: Parameters<typeof userHasAccess>) => mockUserHasAccess(...args),
}));

// Helper to create a mock user
function createMockUser(privileges: string[] = [], roles: string[] = []): LoggedInUser {
  return {
    uuid: 'user-uuid',
    display: 'Test User',
    username: 'testuser',
    systemId: 'testuser',
    userProperties: {},
    person: {
      uuid: 'person-uuid',
      display: 'Test User',
    },
    privileges: privileges.map((priv) => ({
      uuid: `priv-${priv}`,
      display: priv,
    })) as Privilege[],
    roles: roles.map((role) => ({
      uuid: `role-${role}`,
      display: role,
    })) as Role[],
    retired: false,
    locale: 'en',
    allowedLocales: ['en'],
  };
}

type SessionState = { loaded: boolean; session: { authenticated: boolean; sessionId: string; user?: LoggedInUser } };

/**
 * Builds a minimal stand-in for the session store {@link UserHasAccess} consumes:
 * `getState()` returns the current state synchronously and `subscribe()` registers
 * a listener and returns an unsubscribe function. `emit()` lets tests push updates.
 */
function createFakeStore(user: LoggedInUser | null, unsubscribe: () => void = vi.fn()) {
  const listeners = new Set<(state: SessionState) => void>();
  let state: SessionState = {
    loaded: true,
    session: user ? { authenticated: true, sessionId: 'test-session', user } : { authenticated: false, sessionId: '' },
  };
  return {
    getState: () => state,
    subscribe: vi.fn((listener: (state: SessionState) => void) => {
      listeners.add(listener);
      return unsubscribe;
    }),
    emit(nextUser: LoggedInUser | null) {
      state = {
        loaded: true,
        session: nextUser
          ? { authenticated: true, sessionId: 'test-session', user: nextUser }
          : { authenticated: false, sessionId: '' },
      };
      listeners.forEach((listener) => listener(state));
    },
  };
}

describe('UserHasAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('when user has required privilege', () => {
    it('should render children for single privilege', () => {
      const user = createMockUser(['Edit Patients']);

      mockGetSessionStore.mockReturnValue(createFakeStore(user));
      mockUserHasAccess.mockReturnValue(true);

      render(
        <UserHasAccess privilege="Edit Patients">
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockUserHasAccess).toHaveBeenCalledWith('Edit Patients', user);
    });

    it('should render children for multiple privileges', () => {
      const user = createMockUser(['Edit Patients', 'Delete Patients']);

      mockGetSessionStore.mockReturnValue(createFakeStore(user));
      mockUserHasAccess.mockReturnValue(true);

      render(
        <UserHasAccess privilege={['Edit Patients', 'Delete Patients']}>
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockUserHasAccess).toHaveBeenCalledWith(['Edit Patients', 'Delete Patients'], user);
    });

    it('should render multiple children', () => {
      const user = createMockUser(['Edit Patients']);

      mockGetSessionStore.mockReturnValue(createFakeStore(user));
      mockUserHasAccess.mockReturnValue(true);

      render(
        <UserHasAccess privilege="Edit Patients">
          <div>First Child</div>
          <div>Second Child</div>
        </UserHasAccess>,
      );

      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
    });
  });

  describe('when user does not have required privilege', () => {
    it('should render nothing when no fallback provided', () => {
      const user = createMockUser(['View Patients']);

      mockGetSessionStore.mockReturnValue(createFakeStore(user));
      mockUserHasAccess.mockReturnValue(false);

      const { container } = render(
        <UserHasAccess privilege="Edit Patients">
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      // eslint-disable-next-line jest-dom/prefer-empty, testing-library/no-node-access
      expect(container.firstChild).toBeNull();
    });

    it('should render fallback when provided', () => {
      const user = createMockUser(['View Patients']);

      mockGetSessionStore.mockReturnValue(createFakeStore(user));
      mockUserHasAccess.mockReturnValue(false);

      render(
        <UserHasAccess privilege="Edit Patients" fallback={<div>Access Denied</div>}>
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('should render fallback for missing privilege in array', () => {
      const user = createMockUser(['Edit Patients']); // Has one but not both

      mockGetSessionStore.mockReturnValue(createFakeStore(user));
      mockUserHasAccess.mockReturnValue(false);

      render(
        <UserHasAccess privilege={['Edit Patients', 'Delete Patients']} fallback={<div>Need all privileges</div>}>
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('Need all privileges')).toBeInTheDocument();
    });
  });

  describe('when user is not logged in', () => {
    it('should render nothing when no fallback provided', () => {
      mockGetSessionStore.mockReturnValue(createFakeStore(null));
      mockUserHasAccess.mockReturnValue(false);

      const { container } = render(
        <UserHasAccess privilege="Edit Patients">
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      // eslint-disable-next-line jest-dom/prefer-empty, testing-library/no-node-access
      expect(container.firstChild).toBeNull();
    });

    it('should render fallback when provided', () => {
      mockGetSessionStore.mockReturnValue(createFakeStore(null));
      mockUserHasAccess.mockReturnValue(false);

      render(
        <UserHasAccess privilege="Edit Patients" fallback={<div>Please log in</div>}>
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('Please log in')).toBeInTheDocument();
    });
  });

  describe('session subscription management', () => {
    it('should subscribe to the session store on mount', () => {
      const user = createMockUser(['Edit Patients']);
      const store = createFakeStore(user);

      mockGetSessionStore.mockReturnValue(store);
      mockUserHasAccess.mockReturnValue(true);

      render(
        <UserHasAccess privilege="Edit Patients">
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(mockGetSessionStore).toHaveBeenCalled();
      expect(store.subscribe).toHaveBeenCalled();
    });

    it('should unsubscribe from the session store on unmount', () => {
      const user = createMockUser(['Edit Patients']);
      const unsubscribeMock = vi.fn();
      const store = createFakeStore(user, unsubscribeMock);

      mockGetSessionStore.mockReturnValue(store);
      mockUserHasAccess.mockReturnValue(true);

      const { unmount } = render(
        <UserHasAccess privilege="Edit Patients">
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      unmount();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });

  describe('user updates', () => {
    it('should update when the session changes', async () => {
      const user1 = createMockUser(['View Patients']);
      const user2 = createMockUser(['Edit Patients']);
      const store = createFakeStore(user1);

      mockGetSessionStore.mockReturnValue(store);

      // Initially user doesn't have access
      mockUserHasAccess.mockReturnValue(false);

      render(
        <UserHasAccess privilege="Edit Patients" fallback={<div>No Access</div>}>
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('No Access')).toBeInTheDocument();

      // User gains access
      mockUserHasAccess.mockReturnValue(true);
      store.emit(user2);

      await waitFor(() => {
        expect(screen.queryByText('No Access')).not.toBeInTheDocument();
      });
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty children gracefully', () => {
      const user = createMockUser(['Edit Patients']);

      mockGetSessionStore.mockReturnValue(createFakeStore(user));
      mockUserHasAccess.mockReturnValue(true);

      const { container } = render(<UserHasAccess privilege="Edit Patients" />);

      // Should render empty fragment
      // eslint-disable-next-line jest-dom/prefer-empty, testing-library/no-node-access
      expect(container.firstChild).toBeNull();
    });

    it('should handle complex fallback component', () => {
      const user = createMockUser(['View Patients']);

      mockGetSessionStore.mockReturnValue(createFakeStore(user));
      mockUserHasAccess.mockReturnValue(false);

      render(
        <UserHasAccess
          privilege="Edit Patients"
          fallback={
            <div>
              <h1>Access Denied</h1>
              <p>Contact administrator</p>
            </div>
          }
        >
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText('Contact administrator')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
