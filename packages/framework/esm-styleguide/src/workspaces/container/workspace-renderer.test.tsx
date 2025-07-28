import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { mountRootParcel } from 'single-spa';
import { WorkspaceRenderer } from './workspace-renderer.component';
import { getWorkspaceGroupStore } from '../workspaces';

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
    const mockLoadFn = vi.fn().mockImplementation(() => Promise.resolve('file-content'));

    getWorkspaceGroupStore('test-sidebar-store')?.setState({
      // Testing that the workspace group state should be overrided by additionalProps
      foo: false,
      workspaceGroupStore: {},
    });
    render(
      <WorkspaceRenderer
        // @ts-ignore The workspace is of type OpenWorkspace and not all properties are required
        workspace={{
          closeWorkspace: mockCloseWorkspace,
          name: 'workspace-name',
          load: mockLoadFn,
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
    expect(mockLoadFn).toHaveBeenCalled();

    await screen.findByTestId('mocked-parcel');

    expect(mockFn).toHaveBeenCalledWith({
      config: 'file-content',
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
