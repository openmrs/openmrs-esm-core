import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop } from '@openmrs/esm-react-utils';
import { WorkspaceWindow } from './workspace-window.component';
import { launchWorkspace, registerWorkspace } from '..';

const mockExtensionRegistry = {};
const mockedIsDesktop = isDesktop as jest.Mock;

jest.mock('./workspace-renderer.component', () => ({
  WorkspaceRenderer: jest.fn().mockImplementation(() => <div>Workspace-Renderer</div>),
}));

jest.mock('@openmrs/esm-react-utils', () => {
  const originalModule = jest.requireActual('@openmrs/esm-react-utils');

  return {
    ...originalModule,
    isDesktop: jest.fn(),
    useBodyScrollLock: jest.fn(),
  };
});

jest.mock('@openmrs/esm-translations', () => {
  const originalModule = jest.requireActual('@openmrs/esm-translations');

  return {
    ...originalModule,
    translateFrom: (module, key, defaultValue, options) => defaultValue,
  };
});

xdescribe('WorkspaceWindow', () => {
  test('should reopen hidden workspace window when user relaunches the same workspace window', async () => {
    const user = userEvent.setup();

    registerWorkspace({ name: 'Clinical Form', title: 'Clinical Form', load: jest.fn(), moduleName: '@openmrs/foo' });
    launchWorkspace('Clinical Form', { workspaceTitle: 'POC Triage' });
    mockedIsDesktop.mockReturnValue(true);

    renderWorkspaceWindow();

    expect(screen.getByRole('banner', { name: 'Workspace Title' })).toBeInTheDocument();
    expect(screen.getByText('POC Triage')).toBeInTheDocument();

    const workspaceContainer = screen.getByRole('complementary');
    expect(workspaceContainer).toHaveClass('show');

    const hideButton = screen.getByRole('button', { name: 'Hide' });

    user.click(hideButton);

    expect(workspaceContainer).toHaveClass('hide');

    await launchWorkspace('Clinical Form', { workspaceTitle: 'POC Triage' });

    expect(await screen.findByRole('complementary')).toHaveClass('show');
  });

  test('should toggle between maximized and normal screen size', async () => {
    const user = userEvent.setup();

    renderWorkspaceWindow();

    const maximizeButton = await screen.findByRole('button', { name: 'Maximize' });

    user.click(maximizeButton);
    expect(screen.getByRole('complementary')).toHaveClass('maximized');

    const minimizeButton = await screen.findByRole('button', { name: 'Minimize' });

    user.click(minimizeButton);

    expect(screen.getByRole('complementary')).not.toHaveClass('maximized');
  });
});

function renderWorkspaceWindow() {
  render(<WorkspaceWindow contextKey="foo" />);
}
