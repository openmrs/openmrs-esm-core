import React from 'react';
import { screen, render, within, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentContext, isDesktop } from '@openmrs/esm-react-utils';
import { WorkspaceWindow } from './workspace-window.component';
import { launchWorkspace, registerWorkspace, useWorkspaces } from '..';

const mockedIsDesktop = isDesktop as jest.Mock;

window.history.pushState({}, 'Workspace Window', '/workspace-window');

jest.mock('./workspace-renderer.component', () => ({
  WorkspaceRenderer: jest.fn().mockImplementation(() => <div>Workspace-Renderer</div>),
}));

jest.mock('@openmrs/esm-translations', () => {
  const originalModule = jest.requireActual('@openmrs/esm-translations');

  return {
    ...originalModule,
    translateFrom: (module, key, defaultValue, options) => defaultValue,
  };
});

describe('WorkspaceWindow', () => {
  beforeAll(() => {
    registerWorkspace({
      name: 'Clinical Form',
      title: 'Clinical Form',
      load: jest.fn(),
      moduleName: '@openmrs/foo',
      canHide: true,
      canMaximize: true,
    });
  });

  test('should override title; should reopen hidden workspace window when user relaunches the same workspace window', async () => {
    const user = userEvent.setup();
    const workspaces = renderHook(() => useWorkspaces());
    mockedIsDesktop.mockReturnValue(true);
    expect(workspaces.result.current.workspaces.length).toBe(0);
    renderWorkspaceWindow();

    act(() => launchWorkspace('Clinical Form', { workspaceTitle: 'POC Triage' }));
    expect(workspaces.result.current.workspaces.length).toBe(1);
    const header = screen.getByRole('banner');
    expect(within(header).getByText('POC Triage')).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();

    const hideButton = screen.getByRole('button', { name: 'Hide' });
    await user.click(hideButton);
    expect(screen.queryByRole('complementary')).toHaveClass('hidden');

    act(() => launchWorkspace('Clinical Form', { workspaceTitle: 'POC Triage' }));
    expect(await screen.findByRole('complementary')).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toHaveClass('hidden');
    expect(workspaces.result.current.workspaces.length).toBe(1);
  });

  test('should toggle between maximized and normal screen size', async () => {
    const user = userEvent.setup();
    mockedIsDesktop.mockReturnValue(true);
    renderWorkspaceWindow();

    act(() => launchWorkspace('Clinical Form'));
    const header = screen.getByRole('banner');
    expect(within(header).getByText('Clinical Form')).toBeInTheDocument();
    expect(screen.getByRole('complementary')).not.toHaveClass('maximizedWindow');

    const maximizeButton = await screen.findByRole('button', { name: 'Maximize' });
    await user.click(maximizeButton);
    expect(screen.getByRole('complementary')).toHaveClass('maximizedWindow');

    const minimizeButton = await screen.findByRole('button', { name: 'Minimize' });
    await user.click(minimizeButton);
    expect(screen.getByRole('complementary')).not.toHaveClass('maximizedWindow');
  });
});

function renderWorkspaceWindow() {
  render(
    <ComponentContext.Provider value={{ featureName: 'test', moduleName: '@openmrs/foo' }}>
      <WorkspaceWindow contextKey="workspace-window" />
    </ComponentContext.Provider>,
  );
}
