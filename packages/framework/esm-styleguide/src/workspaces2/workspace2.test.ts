import { describe, expect, it } from 'vitest';
import type { WorkspaceStoreState2 } from '@openmrs/esm-extensions';
import { workspace2StoreActions } from './workspace2';

function makeState(overrides: Partial<WorkspaceStoreState2> = {}): WorkspaceStoreState2 {
  return {
    registeredGroupsByName: {},
    registeredWindowsByName: {},
    registeredWorkspacesByName: {
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
    },
    openedGroup: null,
    openedWindows: [],
    isMostRecentlyOpenedWindowHidden: false,
    workspaceTitleByWorkspaceName: {},
    ...overrides,
  };
}

function makeOpenedWorkspace(name: string, hasUnsavedChanges = false) {
  return { workspaceName: name, props: {}, hasUnsavedChanges, uuid: `uuid-${name}` };
}

describe('openChildWorkspace', () => {
  it('opens a child workspace from the leaf parent', () => {
    const state = makeState({
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [makeOpenedWorkspace('parent-workspace')],
          props: null,
          maximized: false,
        },
      ],
    });

    const result = workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {
      foo: 'bar',
    });

    expect(result.openedWindows[0].openedWorkspaces).toHaveLength(2);
    expect(result.openedWindows[0].openedWorkspaces[0].workspaceName).toBe('parent-workspace');
    expect(result.openedWindows[0].openedWorkspaces[1].workspaceName).toBe('child-workspace');
    expect(result.openedWindows[0].openedWorkspaces[1].props).toEqual({ foo: 'bar' });
  });

  it('trims workspaces above the parent when parent is not the leaf (double-click race)', () => {
    const state = makeState({
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [makeOpenedWorkspace('parent-workspace'), makeOpenedWorkspace('child-workspace')],
          props: null,
          maximized: false,
        },
      ],
    });

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
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [
            makeOpenedWorkspace('parent-workspace'),
            makeOpenedWorkspace('child-workspace'),
            makeOpenedWorkspace('grandchild-workspace'),
          ],
          props: null,
          maximized: false,
        },
      ],
    });

    // Parent opens a new child — both child and grandchild should be trimmed
    const result = workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {});

    expect(result.openedWindows[0].openedWorkspaces).toHaveLength(2);
    expect(result.openedWindows[0].openedWorkspaces[0].workspaceName).toBe('parent-workspace');
    expect(result.openedWindows[0].openedWorkspaces[1].workspaceName).toBe('child-workspace');
  });

  it('throws when child workspace is not registered', () => {
    const state = makeState({
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [makeOpenedWorkspace('parent-workspace')],
          props: null,
          maximized: false,
        },
      ],
    });

    expect(() =>
      workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'nonexistent-workspace', {}),
    ).toThrow('No workspace named "nonexistent-workspace" registered');
  });

  it('throws when parent workspace is not registered', () => {
    const state = makeState({
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [makeOpenedWorkspace('parent-workspace')],
          props: null,
          maximized: false,
        },
      ],
    });

    expect(() => workspace2StoreActions.openChildWorkspace(state, 'nonexistent-parent', 'child-workspace', {})).toThrow(
      'No workspace named "nonexistent-parent" registered',
    );
  });

  it('throws when child belongs to a different window than parent', () => {
    const state = makeState({
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [makeOpenedWorkspace('parent-workspace')],
          props: null,
          maximized: false,
        },
      ],
    });

    expect(() =>
      workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'other-window-workspace', {}),
    ).toThrow('does not belong to the same workspace window');
  });

  it('throws when the window is not opened', () => {
    const state = makeState({
      openedWindows: [],
    });

    expect(() => workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {})).toThrow(
      'window test-window is not opened',
    );
  });

  it('throws when the parent workspace is not in the opened window', () => {
    const state = makeState({
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [makeOpenedWorkspace('child-workspace')],
          props: null,
          maximized: false,
        },
      ],
    });

    expect(() =>
      workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'grandchild-workspace', {}),
    ).toThrow('parent is not opened within the workspace window');
  });

  it('does not mutate the original state', () => {
    const originalWorkspaces = [makeOpenedWorkspace('parent-workspace'), makeOpenedWorkspace('child-workspace')];
    const state = makeState({
      openedWindows: [
        {
          windowName: 'test-window',
          openedWorkspaces: [...originalWorkspaces],
          props: null,
          maximized: false,
        },
      ],
    });

    workspace2StoreActions.openChildWorkspace(state, 'parent-workspace', 'child-workspace', {});

    // Original state should be untouched
    expect(state.openedWindows[0].openedWorkspaces).toHaveLength(2);
    expect(state.openedWindows[0].openedWorkspaces[0].workspaceName).toBe('parent-workspace');
    expect(state.openedWindows[0].openedWorkspaces[1].workspaceName).toBe('child-workspace');
  });
});
