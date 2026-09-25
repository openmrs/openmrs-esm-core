import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { workspace2Store, type OpenedWindow, type OpenedWorkspace } from '@openmrs/esm-extensions';
import { loadLifeCycles } from '@openmrs/esm-routes';
import ActiveWorkspaceWindow from './active-workspace-window.component';
import { type Workspace2DefinitionProps } from './workspace2.component';
import { type WorkspaceWindowActions } from './workspace-window-actions';

vi.mock('@openmrs/esm-routes', () => ({
  loadLifeCycles: vi.fn(),
}));

// Records the props each parcel was handed, keyed by workspace name, so tests can call them the way
// the workspace component would.
const { parcelProps } = vi.hoisted(() => ({ parcelProps: {} as Record<string, Workspace2DefinitionProps> }));
vi.mock('single-spa-react/parcel', () => ({
  default: ({ config, ...props }: { config: { name: string } } & Workspace2DefinitionProps) => {
    parcelProps[props.workspaceName] = props;
    return <div data-testid="parcel">{config.name}</div>;
  },
}));

const mockLoadLifeCycles = vi.mocked(loadLifeCycles);

function makeActions(): WorkspaceWindowActions {
  return {
    closeWorkspace: vi.fn(),
    openChildWorkspace: vi.fn(),
    setWorkspaceTitle: vi.fn(),
    setHasUnsavedChanges: vi.fn(),
    promptForClosingWorkspaces: vi.fn().mockResolvedValue(true),
  };
}

function makeOpenedWorkspace(workspaceName: string, uuid: string, overrides: Partial<OpenedWorkspace> = {}) {
  return { workspaceName, uuid, props: {}, hasUnsavedChanges: false, ...overrides };
}

function makeOpenedWindow(openedWorkspaces: Array<OpenedWorkspace>): OpenedWindow {
  return {
    windowName: 'test-window',
    openedWorkspaces,
    props: {},
    maximized: false,
  };
}

function renderWindow(openedWindow: OpenedWindow, actions: WorkspaceWindowActions, renderChrome = false) {
  return (
    <ActiveWorkspaceWindow
      openedWindow={openedWindow}
      groupProps={null}
      actions={actions}
      renderChrome={renderChrome}
      showActionMenu={false}
    />
  );
}

async function flushLifeCycles() {
  await act(async () => {
    await Promise.resolve();
  });
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
      openedGroup: null,
      openedWindows: [],
    } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
    for (const workspaceName of Object.keys(parcelProps)) {
      delete parcelProps[workspaceName];
    }
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

    const actions = makeActions();
    const formWorkspace = makeOpenedWorkspace('form-workspace', 'uuid-form');
    const { rerender } = render(renderWindow(makeOpenedWindow([formWorkspace]), actions));

    await flushLifeCycles();
    expect(screen.getByTestId('parcel')).toHaveTextContent('form-lifecycle');

    // Replace the workspace at index 0, as happens when a workspace is closed and
    // another is opened in quick succession.
    const admitWorkspace = makeOpenedWorkspace('admit-workspace', 'uuid-admit');
    rerender(renderWindow(makeOpenedWindow([admitWorkspace]), actions));

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

    render(renderWindow(makeOpenedWindow([makeOpenedWorkspace('form-workspace', 'uuid-form')]), makeActions()));
    await flushLifeCycles();

    expect(parcelProps['form-workspace'].workspaceMeta).toEqual({ columns: 3, title: 'Form' });
  });

  it('passes an empty workspaceMeta when the workspace declares no meta', async () => {
    mockLoadLifeCycles.mockResolvedValue({ name: 'admit-lifecycle' } as never);

    render(renderWindow(makeOpenedWindow([makeOpenedWorkspace('admit-workspace', 'uuid-admit')]), makeActions()));
    await flushLifeCycles();

    expect(parcelProps['admit-workspace'].workspaceMeta).toEqual({});
  });

  it('renders the title bar with the reported title only when rendering chrome', async () => {
    mockLoadLifeCycles.mockResolvedValue({ name: 'form-lifecycle' } as never);
    const actions = makeActions();
    const openedWindow = makeOpenedWindow([makeOpenedWorkspace('form-workspace', 'uuid-form', { title: 'My form' })]);

    const { rerender } = render(renderWindow(openedWindow, actions, true));
    await flushLifeCycles();
    expect(screen.getByText('My form')).toBeInTheDocument();
    expect(screen.getByTestId('parcel')).toBeInTheDocument();

    rerender(renderWindow(openedWindow, actions, false));
    expect(screen.queryByText('My form')).not.toBeInTheDocument();
    expect(screen.getByTestId('parcel')).toBeInTheDocument();
  });

  it('binds the parcel props to the workspace instance and the window actions', async () => {
    mockLoadLifeCycles.mockResolvedValue({ name: 'lifecycle' } as never);
    const actions = makeActions();
    const openedWindow = makeOpenedWindow([
      makeOpenedWorkspace('form-workspace', 'uuid-form'),
      makeOpenedWorkspace('admit-workspace', 'uuid-admit', { hasUnsavedChanges: true }),
    ]);

    render(renderWindow(openedWindow, actions));
    await flushLifeCycles();

    const formProps = parcelProps['form-workspace'];
    formProps.setWorkspaceTitle('Form title');
    formProps.setHasUnsavedChanges(true);
    expect(actions.setWorkspaceTitle).toHaveBeenCalledWith('uuid-form', 'Form title');
    expect(actions.setHasUnsavedChanges).toHaveBeenCalledWith('uuid-form', true);

    // Launching a new child of the root first prompts about the unsaved workspace above it.
    await formProps.launchChildWorkspace('admit-workspace', { foo: 'bar' });
    expect(actions.promptForClosingWorkspaces).toHaveBeenCalledWith('admit-workspace');
    expect(actions.openChildWorkspace).toHaveBeenCalledWith('form-workspace', 'admit-workspace', { foo: 'bar' });

    await expect(parcelProps['admit-workspace'].closeWorkspace()).resolves.toBe(true);
    expect(actions.promptForClosingWorkspaces).toHaveBeenLastCalledWith('admit-workspace');
    expect(actions.closeWorkspace).toHaveBeenLastCalledWith('admit-workspace');

    await expect(parcelProps['admit-workspace'].closeWorkspace({ closeWindow: true })).resolves.toBe(true);
    expect(actions.promptForClosingWorkspaces).toHaveBeenLastCalledWith();
    expect(actions.closeWorkspace).toHaveBeenLastCalledWith('form-workspace');
  });

  it('does not close the workspace when the user cancels the prompt', async () => {
    mockLoadLifeCycles.mockResolvedValue({ name: 'lifecycle' } as never);
    const actions = makeActions();
    vi.mocked(actions.promptForClosingWorkspaces).mockResolvedValue(false);

    render(renderWindow(makeOpenedWindow([makeOpenedWorkspace('form-workspace', 'uuid-form')]), actions));
    await flushLifeCycles();

    await expect(parcelProps['form-workspace'].closeWorkspace()).resolves.toBe(false);
    expect(actions.closeWorkspace).not.toHaveBeenCalled();
  });
});
