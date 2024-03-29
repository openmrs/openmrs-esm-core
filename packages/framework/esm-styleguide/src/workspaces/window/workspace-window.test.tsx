import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop } from '@openmrs/esm-framework';
import { launchPatientWorkspace, registerWorkspace } from '@openmrs/esm-patient-common-lib';
import { mockPatient } from 'tools';
import WorkspaceWindow from './workspace-window.component';

const mockExtensionRegistry = {};
const mockedIsDesktop = isDesktop as jest.Mock;

jest.mock('./workspace-renderer.component', () => ({
  WorkspaceRenderer: jest.fn().mockImplementation(() => <div>Workspace-Renderer</div>),
}));

jest.mock('@openmrs/esm-framework', () => {
  const originalModule = jest.requireActual('@openmrs/esm-framework');

  return {
    ...originalModule,
    isDesktop: jest.fn(),
    translateFrom: (module, key, defaultValue, options) => defaultValue,
    useBodyScrollLock: jest.fn(),
  };
});

const path = `/patient/:patientUuid/chart`;
// const sampleMatchProp: match<{ patientUuid: string }> = {
//   isExact: false,
//   path,
//   url: path.replace(':patientUuid', '1'),
//   params: { patientUuid: '1' },
// };
// const mockRoute: RouteComponentProps<{ patientUuid: string }> = {
//   history: '' as any,
//   location: '' as any,
//   match: sampleMatchProp,
// };

xdescribe('WorkspaceWindow', () => {
  test('should reopen hidden workspace window when user relaunches the same workspace window', async () => {
    const user = userEvent.setup();

    registerWorkspace({ name: 'Clinical Form', title: 'Clinical Form', load: jest.fn() });
    launchPatientWorkspace('Clinical Form', { workspaceTitle: 'POC Triage' });
    mockedIsDesktop.mockReturnValue(true);

    renderWorkspaceWindow();

    expect(screen.getByRole('banner', { name: 'Workspace Title' })).toBeInTheDocument();
    expect(screen.getByText('POC Triage')).toBeInTheDocument();

    const workspaceContainer = screen.getByRole('complementary');
    expect(workspaceContainer).toHaveClass('show');

    const hideButton = screen.getByRole('button', { name: 'Hide' });

    user.click(hideButton);

    expect(workspaceContainer).toHaveClass('hide');

    await launchPatientWorkspace('Clinical Form', { workspaceTitle: 'POC Triage' });

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
  render(<WorkspaceWindow patientUuid={mockPatient.id} />);
}
