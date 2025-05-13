import React, { Suspense } from 'react';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useSession, __cleanup } from './useSession';
import { createGlobalStore } from '@openmrs/esm-state';
import { type SessionStore } from '@openmrs/esm-api';

const mockSessionStore = createGlobalStore<SessionStore>('mockSessionStore', {
  loaded: false,
  session: null,
});

vi.mock('@openmrs/esm-api', () => ({
  getSessionStore: vi.fn(() => mockSessionStore),
}));

function Component() {
  const session = useSession();
  return <div>{JSON.stringify(session)}</div>;
}

describe('useSession', () => {
  afterAll(vi.clearAllMocks);

  beforeEach(() => {
    __cleanup();
    mockSessionStore.setState({ loaded: false, session: null });
  });

  it('should suspend and then resolve to the session', async () => {
    render(
      <Suspense fallback={'suspended'}>
        <Component />
      </Suspense>,
    );

    expect(screen.getByText('suspended')).toBeInTheDocument();
    act(() => {
      mockSessionStore.setState({
        loaded: true,
        session: { authenticated: false, sessionId: 'test1' },
      });
    });
    await screen.findByText(/"authenticated":false/);
  });

  it('should resolve immediately when the session is present', async () => {
    mockSessionStore.setState({
      loaded: true,
      session: { authenticated: false, sessionId: 'test2' },
    });
    render(
      <Suspense fallback={'suspended'}>
        <Component />
      </Suspense>,
    );
    expect(screen.getByText(/"authenticated":false/)).toBeInTheDocument();
  });

  it('should not return stale data when re-created', async () => {
    const { unmount } = render(
      <Suspense fallback={'suspended'}>
        <Component />
      </Suspense>,
    );
    expect(screen.getByText('suspended')).toBeInTheDocument();
    act(() => {
      mockSessionStore.setState({
        loaded: true,
        session: { authenticated: true, sessionId: 'test3' },
      });
    });
    await screen.findByText(/"authenticated":true/);
    unmount();
    mockSessionStore.setState({
      loaded: true,
      session: { authenticated: false, sessionId: 'test3' },
    });
    render(
      <Suspense fallback={'suspended'}>
        <Component />
      </Suspense>,
    );
    expect(screen.getByText(/"authenticated":false/)).toBeInTheDocument();
  });

  it('supports multiple instances of useSession that all receive updates', async () => {
    mockSessionStore.setState({
      loaded: true,
      session: { authenticated: false, sessionId: 'test2' },
    });
    render(
      <Suspense fallback={'suspended'}>
        <div data-testid="component1">
          <Component />
        </div>
        <div data-testid="component2">
          <Component />
        </div>
      </Suspense>,
    );
    expect(screen.getByTestId('component1')).toHaveTextContent(/"authenticated":false/);
    expect(screen.getByTestId('component2')).toHaveTextContent(/"authenticated":false/);
    act(() => {
      mockSessionStore.setState({
        loaded: true,
        session: { authenticated: true, sessionId: 'test3' },
      });
    });
    expect(screen.getByTestId('component1')).toHaveTextContent(/"authenticated":true/);
    expect(screen.getByTestId('component2')).toHaveTextContent(/"authenticated":true/);
  });
});
