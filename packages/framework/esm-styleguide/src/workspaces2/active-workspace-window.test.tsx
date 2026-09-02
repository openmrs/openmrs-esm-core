import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { workspace2Store, type OpenedWindow, type OpenedWorkspace } from '@openmrs/esm-extensions';
import { loadLifeCycles } from '@openmrs/esm-routes';
import ActiveWorkspaceWindow from './active-workspace-window.component';

vi.mock('@openmrs/esm-routes', () => ({
  loadLifeCycles: vi.fn(),
}));

vi.mock('single-spa-react/parcel', () => ({
  default: ({ config }: { config: { name: string } }) => <div data-testid="parcel">{config.name}</div>,
}));

const mockLoadLifeCycles = vi.mocked(loadLifeCycles);

function makeOpenedWorkspace(workspaceName: string, uuid: string): OpenedWorkspace {
  return { workspaceName, uuid, props: {}, hasUnsavedChanges: false } as OpenedWorkspace;
}

function makeOpenedWindow(openedWorkspaces: Array<OpenedWorkspace>): OpenedWindow {
  return {
    windowName: 'test-window',
    openedWorkspaces,
    props: {},
    maximized: false,
  } as OpenedWindow;
}

describe('ActiveWorkspaceWindow', () => {
  beforeEach(() => {
    workspace2Store.setState({
      registeredWorkspacesByName: {
        'form-workspace': {
          name: 'form-workspace',
          component: 'form',
          window: 'test-window',
          moduleName: 'test-module',
        },
        'admit-workspace': {
          name: 'admit-workspace',
          component: 'admit',
          window: 'test-window',
          moduleName: 'test-module',
        },
      },
      registeredWindowsByName: {
        'test-window': { name: 'test-window', group: 'test-group' },
      },
      workspaceTitleByWorkspaceName: {},
      openedGroup: null,
    } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not render a replaced workspace with the previous workspace lifecycle at the same stack position', async () => {
    // The form lifecycle resolves immediately. The admit lifecycle resolves only
    // when we release it, keeping the reload from the stack change pending, which
    // is the window where an index-based lookup served the stale component.
    let resolveAdmit: (config: { name: string }) => void;
    mockLoadLifeCycles.mockImplementation((moduleName, component) => {
      if (component === 'form') {
        return Promise.resolve({ name: 'form-lifecycle' } as never);
      }
      return new Promise((resolve) => {
        resolveAdmit = resolve as never;
      }) as never;
    });

    const formWorkspace = makeOpenedWorkspace('form-workspace', 'uuid-form');
    const { rerender } = render(
      <ActiveWorkspaceWindow openedWindow={makeOpenedWindow([formWorkspace])} showActionMenu={false} />,
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByTestId('parcel')).toHaveTextContent('form-lifecycle');

    // Replace the workspace at index 0, as happens when a workspace is closed and
    // another is opened in quick succession.
    const admitWorkspace = makeOpenedWorkspace('admit-workspace', 'uuid-admit');
    rerender(<ActiveWorkspaceWindow openedWindow={makeOpenedWindow([admitWorkspace])} showActionMenu={false} />);

    // While the admit lifecycle is still loading, the stale form lifecycle must not
    // be mounted for the admit workspace.
    expect(screen.queryByTestId('parcel')).not.toBeInTheDocument();

    await act(async () => {
      resolveAdmit({ name: 'admit-lifecycle' });
      await Promise.resolve();
    });
    expect(screen.getByTestId('parcel')).toHaveTextContent('admit-lifecycle');
  });
});
