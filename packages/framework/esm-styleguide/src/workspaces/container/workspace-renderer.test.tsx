import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { mountRootParcel } from 'single-spa';
import { WorkspaceRenderer } from './workspace-renderer.component';
import { getWorkspaceGroupStore } from '../workspaces';
import { loadLifeCycles } from '@openmrs/esm-dynamic-loading';

const mockFn = vi.fn();

vi.mock('single-spa-react/parcel', () => ({
  default: vi.fn((props) => {
    mockFn(props);
    return <div data-testid="mocked-parcel" />;
  }),
}));

describe('WorkspaceRenderer', () => {
  it('should render workspace', async () => {
    const mockCloseWorkspace = vi.fn();
    const mockCloseWorkspaceWithSavedChanges = vi.fn();
    const mockPromptBeforeClosing = vi.fn();
    const mockSetTitle = vi.fn();

    vi.mocked(loadLifeCycles).mockImplementation(() => Promise.resolve({ default: 'file-content' } as any));

    getWorkspaceGroupStore('test-sidebar-store')?.setState({
      // Testing that the workspace group state should be overrode by additionalProps
      foo: false,
      workspaceGroupStore: {},
    });
    render(
      <WorkspaceRenderer
        // @ts-ignore The workspace is of type OpenWorkspace and not all properties are required
        workspace={{
          closeWorkspace: mockCloseWorkspace,
          name: 'workspace-name',
          component: 'workspace-name',
          moduleName: 'workspace-module',
          title: 'Workspace title',
          closeWorkspaceWithSavedChanges: mockCloseWorkspaceWithSavedChanges,
          promptBeforeClosing: mockPromptBeforeClosing,
          setTitle: mockSetTitle,
          additionalProps: {
            foo: 'true',
          },
        }}
        additionalPropsFromPage={{ bar: 'true' }}
      />,
    );

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
    expect(loadLifeCycles).toHaveBeenCalled();

    await screen.findByTestId('mocked-parcel');

    expect(mockFn).toHaveBeenCalledWith({
      config: { default: 'file-content' },
      mountParcel: mountRootParcel,
      closeWorkspace: mockCloseWorkspace,
      closeWorkspaceWithSavedChanges: mockCloseWorkspaceWithSavedChanges,
      promptBeforeClosing: mockPromptBeforeClosing,
      setTitle: mockSetTitle,
      foo: 'true',
      bar: 'true',
    });
  });
});
