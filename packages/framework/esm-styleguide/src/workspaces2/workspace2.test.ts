import { beforeEach, describe, expect, it } from 'vitest';
import {
  workspace2Store,
  type OpenedWindow,
  type OpenedWorkspace,
  type WorkspaceStoreState2,
} from '@openmrs/esm-extensions';
import {
  closeWorkspaceInWindow,
  openChildWorkspaceInWindow,
  updateOpenedWorkspaceInWindow,
  workspace2StoreActions,
} from './workspace2';

const registeredWorkspacesByName = {
  'parent-workspace': { name: 'parent-workspace', component: 'parent', window: 'test-window', moduleName: 'test' },
  'child-workspace': { name: 'child-workspace', component: 'child', window: 'test-window', moduleName: 'test' },
  'grandchild-workspace': {
    name: 'grandchild-workspace',
    component: 'grandchild',
    window: 'test-window',
    moduleName: 'test',
  },
  'other-window-workspace': {
    name: 'other-window-workspace',
    component: 'other',
    window: 'other-window',
    moduleName: 'test',
  },
};

// The window-level functions read the registered-definition maps from the global store, so seed them there.
beforeEach(() => {
  workspace2Store.setState({ registeredWorkspacesByName } as never);
});

function makeState(overrides: Partial<WorkspaceStoreState2> = {}): WorkspaceStoreState2 {
  return {
    registeredGroupsByName: {},
    registeredWindowsByName: {},
    registeredWorkspacesByName,
    openedGroup: null,
    openedWindows: [],
    isMostRecentlyOpenedWindowHidden: false,
    ...overrides,
  };
}

function makeOpenedWorkspace(name: string): OpenedWorkspace {
  return { workspaceName: name, props: {}, hasUnsavedChanges: false, uuid: `uuid-${name}` };
}

function makeOpenedWindow(workspaceNames: Array<string>, windowName = 'test-window'): OpenedWindow {
  return {
    windowName,
    openedWorkspaces: workspaceNames.map(makeOpenedWorkspace),
    props: null,
    maximized: false,
  };
}

describe('openChildWorkspace', () => {
  it('opens a child workspace from the leaf parent', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['parent-workspace'])] });

    const result = workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {
      foo: 'bar',
    });

    expect(result.openedWindows[0].openedWorkspaces).toHaveLength(2);
    expect(result.openedWindows[0].openedWorkspaces[0].workspaceName).toBe('parent-workspace');
    expect(result.openedWindows[0].openedWorkspaces[1].workspaceName).toBe('child-workspace');
    expect(result.openedWindows[0].openedWorkspaces[1].props).toEqual({ foo: 'bar' });
    expect(result.openedWindows[0].openedWorkspaces[1].hasUnsavedChanges).toBe(false);
  });

  it('trims workspaces above the parent when parent is not the leaf (double-click race)', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['parent-workspace', 'child-workspace'])] });

    // Simulates the second click in a double-click: parent tries to open the same child again
    const result = workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {
      newProps: true,
    });

    expect(result.openedWindows[0].openedWorkspaces).toHaveLength(2);
    expect(result.openedWindows[0].openedWorkspaces[0].workspaceName).toBe('parent-workspace');
    expect(result.openedWindows[0].openedWorkspaces[1].workspaceName).toBe('child-workspace');
    expect(result.openedWindows[0].openedWorkspaces[1].props).toEqual({ newProps: true });
  });

  it('trims grandchild when parent opens a new child', () => {
    const state = makeState({
      openedWindows: [makeOpenedWindow(['parent-workspace', 'child-workspace', 'grandchild-workspace'])],
    });

    // Parent opens a new child — both child and grandchild should be trimmed
    const result = workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {});

    expect(result.openedWindows[0].openedWorkspaces).toHaveLength(2);
    expect(result.openedWindows[0].openedWorkspaces[0].workspaceName).toBe('parent-workspace');
    expect(result.openedWindows[0].openedWorkspaces[1].workspaceName).toBe('child-workspace');
  });

  it('throws when child workspace is not registered', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['parent-workspace'])] });

    expect(() =>
      workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'nonexistent-workspace', {}),
    ).toThrow('No workspace named "nonexistent-workspace" registered');
  });

  it('throws when parent workspace is not registered', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['parent-workspace'])] });

    expect(() => workspace2StoreActions.openChildWorkspace(state, 'nonexistent-parent', 'child-workspace', {})).toThrow(
      'No workspace named "nonexistent-parent" registered',
    );
  });

  it('throws when child belongs to a different window than parent', () => {
    const state = makeState({
      openedWindows: [makeOpenedWindow(['parent-workspace']), makeOpenedWindow([], 'other-window')],
    });

    expect(() =>
      workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'other-window-workspace', {}),
    ).toThrow('does not belong to the same workspace window');
  });

  it('throws when the window is not opened', () => {
    const state = makeState({ openedWindows: [] });

    expect(() => workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {})).toThrow(
      'window test-window is not opened',
    );
  });

  it('throws when the parent workspace is not in the opened window', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['child-workspace'])] });

    expect(() =>
      workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'grandchild-workspace', {}),
    ).toThrow('parent is not opened within the workspace window');
  });

  it('does not mutate the original state', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['parent-workspace', 'child-workspace'])] });

    workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {});

    // Original state should be untouched
    expect(state.openedWindows[0].openedWorkspaces).toHaveLength(2);
    expect(state.openedWindows[0].openedWorkspaces[0].workspaceName).toBe('parent-workspace');
    expect(state.openedWindows[0].openedWorkspaces[1].workspaceName).toBe('child-workspace');
  });
});

describe('closeWorkspace', () => {
  it('closes the workspace along with its children', () => {
    const state = makeState({
      openedWindows: [makeOpenedWindow(['parent-workspace', 'child-workspace', 'grandchild-workspace'])],
    });

    const result = workspace2StoreActions.closeWorkspace(state, 'child-workspace');

    expect(result.openedWindows[0].openedWorkspaces.map((w) => w.workspaceName)).toEqual(['parent-workspace']);
  });

  it('removes the window when its root workspace is closed, and shows the new most recent window', () => {
    const state = makeState({
      openedWindows: [
        makeOpenedWindow(['other-window-workspace'], 'other-window'),
        makeOpenedWindow(['parent-workspace']),
      ],
      isMostRecentlyOpenedWindowHidden: true,
    });

    const result = workspace2StoreActions.closeWorkspace(state, 'parent-workspace');

    expect(result.openedWindows.map((w) => w.windowName)).toEqual(['other-window']);
    expect(result.isMostRecentlyOpenedWindowHidden).toBe(false);
  });

  it('is a no-op when the workspace is not opened', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['parent-workspace'])] });

    expect(workspace2StoreActions.closeWorkspace(state, 'child-workspace')).toBe(state);
  });
});

describe('setWorkspaceTitle / setHasUnsavedChanges', () => {
  it('updates the workspace instance with the given uuid', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['parent-workspace', 'child-workspace'])] });

    const withTitle = workspace2StoreActions.setWorkspaceTitle(state, 'uuid-child-workspace', 'Child');
    const result = workspace2StoreActions.setHasUnsavedChanges(withTitle, 'uuid-child-workspace', true);

    const [parent, child] = result.openedWindows[0].openedWorkspaces;
    expect(child).toMatchObject({ title: 'Child', hasUnsavedChanges: true });
    expect(parent).toBe(state.openedWindows[0].openedWorkspaces[0]);
  });

  it('returns the same state when nothing changes, so subscribers are not notified', () => {
    const state = makeState({ openedWindows: [makeOpenedWindow(['parent-workspace'])] });

    expect(workspace2StoreActions.setHasUnsavedChanges(state, 'uuid-parent-workspace', false)).toBe(state);
    expect(workspace2StoreActions.setWorkspaceTitle(state, 'unknown-uuid', 'Title')).toBe(state);
  });
});

describe('closeWorkspaceInWindow', () => {
  it('closes the workspace along with its children', () => {
    const window = makeOpenedWindow(['parent-workspace', 'child-workspace', 'grandchild-workspace']);

    const result = closeWorkspaceInWindow(window, 'child-workspace');

    expect(result?.openedWorkspaces.map((w) => w.workspaceName)).toEqual(['parent-workspace']);
  });

  it('returns null when the root workspace is closed', () => {
    const window = makeOpenedWindow(['parent-workspace', 'child-workspace']);

    expect(closeWorkspaceInWindow(window, 'parent-workspace')).toBeNull();
  });

  it('returns the same window when the workspace is not in it', () => {
    const window = makeOpenedWindow(['parent-workspace']);

    expect(closeWorkspaceInWindow(window, 'child-workspace')).toBe(window);
  });
});

describe('openChildWorkspaceInWindow', () => {
  it('trims workspaces above the parent and appends the child', () => {
    const window = makeOpenedWindow(['parent-workspace', 'child-workspace', 'grandchild-workspace']);

    const result = openChildWorkspaceInWindow(window, 'parent-workspace', 'child-workspace', { foo: 'bar' });

    expect(result.openedWorkspaces.map((w) => w.workspaceName)).toEqual(['parent-workspace', 'child-workspace']);
    expect(result.openedWorkspaces[1].props).toEqual({ foo: 'bar' });
  });

  it('throws when the child does not belong to the given window', () => {
    // Both workspaces belong to test-window, but the window passed in is a different one.
    const window = makeOpenedWindow(['parent-workspace'], 'other-window');

    expect(() => openChildWorkspaceInWindow(window, 'parent-workspace', 'child-workspace', {})).toThrow(
      'window test-window is not opened',
    );
  });
});

describe('updateOpenedWorkspaceInWindow', () => {
  it('updates only the workspace instance with the given uuid', () => {
    const window = makeOpenedWindow(['parent-workspace', 'child-workspace']);

    const result = updateOpenedWorkspaceInWindow(window, 'uuid-parent-workspace', { title: 'Parent' });

    expect(result.openedWorkspaces[0].title).toBe('Parent');
    expect(result.openedWorkspaces[1]).toBe(window.openedWorkspaces[1]);
    expect(window.openedWorkspaces[0].title).toBeUndefined();
  });

  it('returns the same window for an unknown uuid or an unchanged value', () => {
    const window = makeOpenedWindow(['parent-workspace']);

    expect(updateOpenedWorkspaceInWindow(window, 'unknown-uuid', { title: 'Title' })).toBe(window);
    expect(updateOpenedWorkspaceInWindow(window, 'uuid-parent-workspace', { hasUnsavedChanges: false })).toBe(window);
  });
});
