import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { workspace2Store, type OpenedWindow, type OpenedWorkspace } from '@openmrs/esm-extensions';
import { loadLifeCycles } from '@openmrs/esm-routes';
import ActiveWorkspaceWindow from './active-workspace-window.component';

vi.mock('@openmrs/esm-routes', () => ({
  loadLifeCycles: vi.fn(),
}));

// Captures the props single-spa-react's <Parcel> is handed, so the passthrough of workspace props
// (workspaceMeta included) can be asserted. Hoisted so the mock factory can reference it.
const { parcelProps } = vi.hoisted(() => ({ parcelProps: [] as Array<Record<string, any>> }));

vi.mock('single-spa-react/parcel', () => ({
  default: (props: { config: { name: string } }) => {
    parcelProps.push(props);
    return <div data-testid="parcel">{props.config.name}</div>;
  },
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
          meta: { columns: 3, title: 'Form' },
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
    parcelProps.length = 0;
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

  it("passes the workspace's registered meta to the parcel via workspaceMeta", async () => {
    mockLoadLifeCycles.mockResolvedValue({ name: 'form-lifecycle' } as never);

    const formWorkspace = makeOpenedWorkspace('form-workspace', 'uuid-form');
    render(<ActiveWorkspaceWindow openedWindow={makeOpenedWindow([formWorkspace])} showActionMenu={false} />);

    await act(async () => {
      await Promise.resolve();
    });

    const props = parcelProps.find((p) => p.config.name === 'form-lifecycle');
    expect(props?.workspaceMeta).toEqual({ columns: 3, title: 'Form' });
  });

  it('passes an empty workspaceMeta when the workspace declares no meta', async () => {
    mockLoadLifeCycles.mockResolvedValue({ name: 'admit-lifecycle' } as never);

    const admitWorkspace = makeOpenedWorkspace('admit-workspace', 'uuid-admit');
    render(<ActiveWorkspaceWindow openedWindow={makeOpenedWindow([admitWorkspace])} showActionMenu={false} />);

    await act(async () => {
      await Promise.resolve();
    });

    const props = parcelProps.find((p) => p.config.name === 'admit-lifecycle');
    expect(props?.workspaceMeta).toEqual({});
  });
});
