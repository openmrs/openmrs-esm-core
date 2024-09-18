import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorkspaceRenderer } from './workspace-renderer.component';
import { getWorkspaceFamilyStore, OpenWorkspace } from '../workspaces';
import Parcel from 'single-spa-react/parcel';

const mockFn = jest.fn();

jest.mock('single-spa-react/parcel', () =>
  jest.fn((props) => {
    mockFn(props);
    return <div data-testid="mocked-parcel" />;
  }),
);

describe('WorkspaceRenderer', () => {
  it('should render workspace', async () => {
    const mockedCloseWorkspace = jest.fn();
    const mockedCloseWorkspaceWithSavedChanges = jest.fn();
    const mockedPromptBeforeClosing = jest.fn();
    const mockedSetTitle = jest.fn();
    const mockedLoadFn = jest.fn().mockImplementation(() => Promise.resolve({ default: 'file-content' }));
    getWorkspaceFamilyStore('test-sidebar-family')?.setState({
      // Testing that the workspace family state should be overrided by additionalProps
      foo: false,
      workspaceFamilyState: {},
    });
    render(
      <WorkspaceRenderer
        // @ts-ignore The workspace is of type OpenWorkspace and not all properties are required
        workspace={{
          closeWorkspace: mockedCloseWorkspace,
          name: 'workspace-name',
          load: mockedLoadFn,
          title: 'Workspace title',
          closeWorkspaceWithSavedChanges: mockedCloseWorkspaceWithSavedChanges,
          promptBeforeClosing: mockedPromptBeforeClosing,
          setTitle: mockedSetTitle,
          additionalProps: {
            foo: 'true',
          },
          sidebarFamily: 'test-sidebar-family',
        }}
        additionalPropsFromPage={{ bar: 'true' }}
      />,
    );

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
    expect(mockedLoadFn).toHaveBeenCalled();
    await screen.findByTestId('mocked-parcel');

    expect(mockFn).toHaveBeenCalledWith({
      config: 'file-content',
      mountParcel: undefined,
      closeWorkspace: mockedCloseWorkspace,
      closeWorkspaceWithSavedChanges: mockedCloseWorkspaceWithSavedChanges,
      promptBeforeClosing: mockedPromptBeforeClosing,
      setTitle: mockedSetTitle,
      foo: 'true',
      bar: 'true',
      workspaceFamilyState: {},
    });
  });
});
