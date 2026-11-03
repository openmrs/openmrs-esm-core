import { beforeEach, describe, expect, it, vi } from 'vitest';
import { workspace2Store, type OpenedWorkspace } from '@openmrs/esm-extensions';
import { showModal } from '../modals';
import { createGlobalWindowActions } from './workspace-window-actions';

vi.mock('../modals', () => ({
  showModal: vi.fn(),
}));

const mockShowModal = vi.mocked(showModal);

function makeOpenedWorkspace(name: string): OpenedWorkspace {
  return { workspaceName: name, props: {}, hasUnsavedChanges: false, uuid: `uuid-${name}` };
}

function openedWorkspacesInStore() {
  return workspace2Store.getState().openedWindows[0].openedWorkspaces;
}

describe('createGlobalWindowActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    workspace2Store.setState({
      registeredWorkspacesByName: {
        'parent-workspace': {
          name: 'parent-workspace',
          component: 'parent',
          window: 'test-window',
          moduleName: 'test',
        },
        'child-workspace': { name: 'child-workspace', component: 'child', window: 'test-window', moduleName: 'test' },
      },
      openedGroup: { groupName: 'test-group', props: null },
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [makeOpenedWorkspace('parent-workspace')],
          props: null,
          maximized: false,
        },
      ],
      isMostRecentlyOpenedWindowHidden: false,
    } as never);
  });

  it('records the title and unsaved-changes state on the workspace in the global store', () => {
    const actions = createGlobalWindowActions('test-window');

    actions.setWorkspaceTitle('uuid-parent-workspace', 'Parent');
    actions.setHasUnsavedChanges('uuid-parent-workspace', true);

    expect(openedWorkspacesInStore()[0]).toMatchObject({ title: 'Parent', hasUnsavedChanges: true });
  });

  it('opens and closes child workspaces in the global store', () => {
    const actions = createGlobalWindowActions('test-window');

    actions.openChildWorkspace('parent-workspace', 'child-workspace', { foo: 'bar' });
    expect(openedWorkspacesInStore().map((w) => w.workspaceName)).toEqual(['parent-workspace', 'child-workspace']);

    actions.closeWorkspace('child-workspace');
    expect(openedWorkspacesInStore().map((w) => w.workspaceName)).toEqual(['parent-workspace']);

    actions.closeWorkspace('parent-workspace');
    expect(workspace2Store.getState().openedWindows).toHaveLength(0);
  });

  it('prompts only when a workspace in the window has unsaved changes', async () => {
    const actions = createGlobalWindowActions('test-window');

    await expect(actions.promptForClosingWorkspaces()).resolves.toBe(true);
    expect(mockShowModal).not.toHaveBeenCalled();

    actions.setWorkspaceTitle('uuid-parent-workspace', 'Parent');
    actions.setHasUnsavedChanges('uuid-parent-workspace', true);
    mockShowModal.mockReturnValue(vi.fn());

    const confirmed = actions.promptForClosingWorkspaces();
    expect(mockShowModal).toHaveBeenCalledWith(
      'workspace2-close-prompt',
      expect.objectContaining({ affectedWorkspaceTitles: ['Parent'] }),
    );
    (mockShowModal.mock.lastCall?.[1] as { onConfirm(): void }).onConfirm();
    await expect(confirmed).resolves.toBe(true);
  });

  it('resolves without prompting when the window is no longer opened', async () => {
    const actions = createGlobalWindowActions('closed-window');

    await expect(actions.promptForClosingWorkspaces()).resolves.toBe(true);
    expect(mockShowModal).not.toHaveBeenCalled();
  });
});
