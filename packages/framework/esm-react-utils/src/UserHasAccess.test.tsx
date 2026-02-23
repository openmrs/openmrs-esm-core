import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Observable, type Subscriber } from 'rxjs';
import type { LoggedInUser, Privilege, Role } from '@openmrs/esm-api';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { getCurrentUser, userHasAccess } from '@openmrs/esm-api';
import { UserHasAccess } from './UserHasAccess';

// Mock getCurrentUser and userHasAccess
const mockGetCurrentUser = vi.fn();
const mockUserHasAccess = vi.fn();

vi.mock('@openmrs/esm-api', () => ({
  getCurrentUser: (...args: Parameters<typeof getCurrentUser>) => mockGetCurrentUser(...args),
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

      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(user)));
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

      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(user)));
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

      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(user)));
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

      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(user)));
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

      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(user)));
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

      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(user)));
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
      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(null)));
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
      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(null)));
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

  describe('observable subscription management', () => {
    it('should subscribe to getCurrentUser on mount', () => {
      const user = createMockUser(['Edit Patients']);
      const subscribeMock = vi.fn();

      mockGetCurrentUser.mockReturnValue(
        new Observable((subscriber) => {
          subscribeMock();
          subscriber.next(user);
          return () => {};
        }),
      );
      mockUserHasAccess.mockReturnValue(true);

      render(
        <UserHasAccess privilege="Edit Patients">
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(mockGetCurrentUser).toHaveBeenCalledWith({ includeAuthStatus: false });
      expect(subscribeMock).toHaveBeenCalled();
    });

    it('should unsubscribe from getCurrentUser on unmount', () => {
      const user = createMockUser(['Edit Patients']);
      const unsubscribeMock = vi.fn();

      mockGetCurrentUser.mockReturnValue(
        new Observable((subscriber) => {
          subscriber.next(user);
          return unsubscribeMock;
        }),
      );
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
    it('should update when user changes', async () => {
      const user1 = createMockUser(['View Patients']);
      const user2 = createMockUser(['Edit Patients']);

      let subscriber: Subscriber<unknown> | undefined = undefined;
      mockGetCurrentUser.mockReturnValue(
        new Observable((sub) => {
          subscriber = sub;
          sub.next(user1);
          return () => {};
        }),
      );

      // Initially user doesn't have access
      mockUserHasAccess.mockReturnValue(false);

      const { rerender } = render(
        <UserHasAccess privilege="Edit Patients" fallback={<div>No Access</div>}>
          <div>Protected Content</div>
        </UserHasAccess>,
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('No Access')).toBeInTheDocument();

      // User gains access
      mockUserHasAccess.mockReturnValue(true);
      (subscriber as unknown as Subscriber<unknown>)?.next(user2);

      await waitFor(() => {
        expect(screen.queryByText('No Access')).not.toBeInTheDocument();
      });
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty children gracefully', () => {
      const user = createMockUser(['Edit Patients']);

      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(user)));
      mockUserHasAccess.mockReturnValue(true);

      const { container } = render(<UserHasAccess privilege="Edit Patients" />);

      // Should render empty fragment
      // eslint-disable-next-line jest-dom/prefer-empty, testing-library/no-node-access
      expect(container.firstChild).toBeNull();
    });

    it('should handle complex fallback component', () => {
      const user = createMockUser(['View Patients']);

      mockGetCurrentUser.mockReturnValue(new Observable((subscriber) => subscriber.next(user)));
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
