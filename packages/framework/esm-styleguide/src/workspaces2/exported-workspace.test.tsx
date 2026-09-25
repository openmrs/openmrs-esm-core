import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { workspace2Store } from '@openmrs/esm-extensions';
import { loadLifeCycles } from '@openmrs/esm-routes';
import { showModal } from '../modals';
import { ExportedWorkspace, type ExportedWorkspaceWindowInfo } from './exported-workspace.component';
import { type Workspace2DefinitionProps } from './workspace2.component';

vi.mock('@openmrs/esm-routes', () => ({
  loadLifeCycles: vi.fn(),
}));

vi.mock('../modals', () => ({
  showModal: vi.fn(),
}));

// The parcel is where the workspace component (and its <Workspace2>) would mount. We stub it out,
// surface the workspace name it was handed, and record its props (keyed by workspace name) so tests
// can call them the way the workspace component would.
const { parcelProps } = vi.hoisted(() => ({ parcelProps: {} as Record<string, Workspace2DefinitionProps> }));
vi.mock('single-spa-react/parcel', () => ({
  default: (props: Workspace2DefinitionProps) => {
    parcelProps[props.workspaceName] = props;
    return <div data-testid="parcel">{props.workspaceName}</div>;
  },
}));

const mockLoadLifeCycles = vi.mocked(loadLifeCycles);
const mockShowModal = vi.mocked(showModal);

const registrations = {
  registeredWorkspacesByName: {
    'foo-workspace': { name: 'foo-workspace', component: 'foo', window: 'test-window', moduleName: 'test' },
    'bar-workspace': { name: 'bar-workspace', component: 'bar', window: 'test-window', moduleName: 'test' },
  },
  registeredWindowsByName: {
    'test-window': { name: 'test-window', group: 'test-group', moduleName: 'test' },
  },
  registeredGroupsByName: {
    'test-group': { name: 'test-group', moduleName: 'test' },
  },
};

function registerWorkspaces() {
  workspace2Store.setState(registrations as never);
}

function lastModalProps() {
  return mockShowModal.mock.lastCall?.[1] as { onConfirm(): void; onCancel(): void };
}

function renderedWorkspaceNames() {
  return screen.queryAllByTestId('parcel').map((parcel) => parcel.textContent);
}

describe('<ExportedWorkspace>', () => {
  beforeEach(() => {
    mockLoadLifeCycles.mockResolvedValue({ name: 'lifecycle' } as never);
    mockShowModal.mockReturnValue(vi.fn());
    workspace2Store.setState({
      registeredWorkspacesByName: {},
      registeredWindowsByName: {},
      registeredGroupsByName: {},
      openedGroup: null,
      openedWindows: [],
      isMostRecentlyOpenedWindowHidden: false,
    } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
    for (const workspaceName of Object.keys(parcelProps)) {
      delete parcelProps[workspaceName];
    }
  });

  it('renders the named workspace content when the workspace is registered', async () => {
    registerWorkspaces();
    render(<ExportedWorkspace name="foo-workspace" workspaceProps={{ patientUuid: 'p1' }} />);

    expect(await screen.findByTestId('parcel')).toHaveTextContent('foo-workspace');
    expect(parcelProps['foo-workspace'].workspaceProps).toEqual({ patientUuid: 'p1' });
  });

  it('renders nothing until the workspace registers, then seeds it', async () => {
    // Registered after mount, as can happen since <ExportedWorkspace> is declarative.
    render(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} />);
    expect(screen.queryByTestId('parcel')).not.toBeInTheDocument();

    await act(async () => {
      registerWorkspaces();
    });

    expect(await screen.findByTestId('parcel')).toHaveTextContent('foo-workspace');
  });

  it('re-seeds with the new workspace when `name` changes', async () => {
    registerWorkspaces();
    const { rerender } = render(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} />);
    expect(await screen.findByTestId('parcel')).toHaveTextContent('foo-workspace');

    rerender(<ExportedWorkspace name="bar-workspace" workspaceProps={{}} />);
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['bar-workspace']));
  });

  it('re-seeds when `name` switches to an unregistered workspace and back', async () => {
    registerWorkspaces();
    const { rerender } = render(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} />);
    expect(await screen.findByTestId('parcel')).toHaveTextContent('foo-workspace');

    rerender(<ExportedWorkspace name="unregistered-workspace" workspaceProps={{}} />);
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual([]));

    rerender(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} />);
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['foo-workspace']));
  });

  it('navigates child workspaces within itself, without touching the global window system', async () => {
    registerWorkspaces();
    render(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} />);
    await screen.findByTestId('parcel');

    await act(async () => {
      await parcelProps['foo-workspace'].launchChildWorkspace('bar-workspace', { id: 1 });
    });
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['foo-workspace', 'bar-workspace']));
    expect(parcelProps['bar-workspace'].workspaceProps).toEqual({ id: 1 });

    await act(async () => {
      await parcelProps['bar-workspace'].closeWorkspace();
    });
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['foo-workspace']));

    // The real global window system's opened windows must remain empty.
    expect(workspace2Store.getState().openedWindows).toHaveLength(0);
    expect(workspace2Store.getState().openedGroup).toBeNull();
  });

  it('reports window state through onWindowChanged', async () => {
    registerWorkspaces();
    const onWindowChanged = vi.fn<(info: ExportedWorkspaceWindowInfo) => void>();
    render(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} onWindowChanged={onWindowChanged} />);

    await waitFor(() =>
      expect(onWindowChanged).toHaveBeenLastCalledWith({
        workspaceName: 'foo-workspace',
        windowSize: 'normal',
        title: '',
        hasUnsavedChanges: false,
      }),
    );

    // What <Workspace2> reports lands in this component's own window, not the global store.
    act(() => {
      parcelProps['foo-workspace'].setWorkspaceTitle('Foo title');
      parcelProps['foo-workspace'].setHasUnsavedChanges(true);
    });
    await waitFor(() =>
      expect(onWindowChanged).toHaveBeenLastCalledWith({
        workspaceName: 'foo-workspace',
        windowSize: 'normal',
        title: 'Foo title',
        hasUnsavedChanges: true,
      }),
    );
    expect(workspace2Store.getState().openedWindows).toHaveLength(0);

    // Closing the root workspace empties the window.
    await act(async () => {
      await parcelProps['foo-workspace'].closeWorkspace({ discardUnsavedChanges: true });
    });
    await waitFor(() =>
      expect(onWindowChanged).toHaveBeenLastCalledWith({
        workspaceName: null,
        windowSize: 'normal',
        title: '',
        hasUnsavedChanges: false,
      }),
    );
    expect(screen.queryByTestId('parcel')).not.toBeInTheDocument();
  });

  it('prompts before closing a workspace with unsaved changes from within it', async () => {
    registerWorkspaces();
    render(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} />);
    await screen.findByTestId('parcel');

    await act(async () => {
      await parcelProps['foo-workspace'].launchChildWorkspace('bar-workspace');
    });
    await waitFor(() => expect(parcelProps['bar-workspace']).toBeDefined());
    act(() => {
      parcelProps['bar-workspace'].setWorkspaceTitle('Bar title');
      parcelProps['bar-workspace'].setHasUnsavedChanges(true);
    });

    // Cancelling the prompt keeps the workspace open.
    let closed: Promise<boolean>;
    act(() => {
      closed = parcelProps['bar-workspace'].closeWorkspace();
    });
    expect(mockShowModal).toHaveBeenCalledWith(
      'workspace2-close-prompt',
      expect.objectContaining({ affectedWorkspaceTitles: ['Bar title'] }),
    );
    await act(async () => {
      lastModalProps().onCancel();
      await expect(closed).resolves.toBe(false);
    });
    expect(renderedWorkspaceNames()).toEqual(['foo-workspace', 'bar-workspace']);

    // Confirming it closes the workspace.
    act(() => {
      closed = parcelProps['bar-workspace'].closeWorkspace();
    });
    await act(async () => {
      lastModalProps().onConfirm();
      await expect(closed).resolves.toBe(true);
    });
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['foo-workspace']));
  });

  it('discards its child workspaces, without prompting, when remounted with a new React `key`', async () => {
    registerWorkspaces();
    const { rerender } = render(<ExportedWorkspace name="foo-workspace" key="a" workspaceProps={{}} />);
    await screen.findByTestId('parcel');

    await act(async () => {
      await parcelProps['foo-workspace'].launchChildWorkspace('bar-workspace');
    });
    await waitFor(() => expect(parcelProps['bar-workspace']).toBeDefined());
    act(() => {
      parcelProps['bar-workspace'].setHasUnsavedChanges(true);
    });

    rerender(<ExportedWorkspace name="foo-workspace" key="b" workspaceProps={{}} />);
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['foo-workspace']));
    expect(mockShowModal).not.toHaveBeenCalled();
  });

  it('re-seeds with the new props, discarding its child workspaces, when `workspaceProps` change', async () => {
    registerWorkspaces();
    const { rerender } = render(<ExportedWorkspace name="foo-workspace" workspaceProps={{ patientUuid: 'p1' }} />);
    await screen.findByTestId('parcel');

    await act(async () => {
      await parcelProps['foo-workspace'].launchChildWorkspace('bar-workspace');
    });
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['foo-workspace', 'bar-workspace']));

    rerender(<ExportedWorkspace name="foo-workspace" workspaceProps={{ patientUuid: 'p2' }} />);
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['foo-workspace']));
    expect(parcelProps['foo-workspace'].workspaceProps).toEqual({ patientUuid: 'p2' });
    expect(mockShowModal).not.toHaveBeenCalled();
  });

  it('re-seeds with the new props when `windowProps` or `groupProps` change', async () => {
    registerWorkspaces();
    const { rerender } = render(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} windowProps={{ w: 1 }} />);
    await screen.findByTestId('parcel');
    expect(parcelProps['foo-workspace'].windowProps).toEqual({ w: 1 });

    rerender(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} windowProps={{ w: 2 }} />);
    await waitFor(() => expect(parcelProps['foo-workspace'].windowProps).toEqual({ w: 2 }));

    rerender(
      <ExportedWorkspace name="foo-workspace" workspaceProps={{}} windowProps={{ w: 2 }} groupProps={{ g: 1 }} />,
    );
    await waitFor(() => expect(parcelProps['foo-workspace'].groupProps).toEqual({ g: 1 }));
  });

  it('keeps its child workspaces when rerendered with shallowly-equal props', async () => {
    registerWorkspaces();
    const { rerender } = render(<ExportedWorkspace name="foo-workspace" workspaceProps={{ patientUuid: 'p1' }} />);
    await screen.findByTestId('parcel');

    await act(async () => {
      await parcelProps['foo-workspace'].launchChildWorkspace('bar-workspace');
    });
    await waitFor(() => expect(renderedWorkspaceNames()).toEqual(['foo-workspace', 'bar-workspace']));

    rerender(<ExportedWorkspace name="foo-workspace" workspaceProps={{ patientUuid: 'p1' }} />);
    expect(renderedWorkspaceNames()).toEqual(['foo-workspace', 'bar-workspace']);
  });

  it('keeps its state independent of the same workspace opened in the global window system', async () => {
    registerWorkspaces();
    workspace2Store.setState({
      openedGroup: { groupName: 'test-group', props: null },
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [
            {
              workspaceName: 'foo-workspace',
              props: {},
              hasUnsavedChanges: false,
              uuid: 'global-foo',
              title: 'Global',
            },
          ],
          props: null,
          maximized: false,
        },
      ],
    });
    const onWindowChanged = vi.fn<(info: ExportedWorkspaceWindowInfo) => void>();
    render(<ExportedWorkspace name="foo-workspace" workspaceProps={{}} onWindowChanged={onWindowChanged} />);
    await screen.findByTestId('parcel');

    act(() => {
      parcelProps['foo-workspace'].setWorkspaceTitle('Exported');
      parcelProps['foo-workspace'].setHasUnsavedChanges(true);
    });

    await waitFor(() =>
      expect(onWindowChanged).toHaveBeenLastCalledWith(
        expect.objectContaining({ title: 'Exported', hasUnsavedChanges: true }),
      ),
    );
    expect(workspace2Store.getState().openedWindows[0].openedWorkspaces[0]).toMatchObject({
      title: 'Global',
      hasUnsavedChanges: false,
    });
  });
});
