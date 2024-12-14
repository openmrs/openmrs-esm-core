import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorkspaceRenderer } from './workspace-renderer.component';
import { getWorkspaceGroupStore } from '../workspaces';

const mockFn = jest.fn();

jest.mock('single-spa-react/parcel', () =>
  jest.fn((props) => {
    mockFn(props);
    return <div data-testid="mocked-parcel" />;
  }),
);

describe('WorkspaceRenderer', () => {
  it('should render workspace', async () => {
    const mockCloseWorkspace = jest.fn();
    const mockCloseWorkspaceWithSavedChanges = jest.fn();
    const mockPromptBeforeClosing = jest.fn();
    const mockSetTitle = jest.fn();
    const mockLoadFn = jest.fn().mockImplementation(() => Promise.resolve({ default: 'file-content' }));

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
      mountParcel: undefined,
      closeWorkspace: mockCloseWorkspace,
      closeWorkspaceWithSavedChanges: mockCloseWorkspaceWithSavedChanges,
      promptBeforeClosing: mockPromptBeforeClosing,
      setTitle: mockSetTitle,
      foo: 'true',
      bar: 'true',
    });
  });
});
