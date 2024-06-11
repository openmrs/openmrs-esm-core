import React from 'react';
import { screen, render, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import { WorkspaceOverlay } from './workspace-overlay.component';
import { launchWorkspace, registerWorkspace, workspaceStore } from '..';
import '@testing-library/jest-dom';

jest.mock('single-spa-react/parcel', () => jest.fn().mockImplementation(() => <div>Parcel</div>));

const mockedUseLayoutType = useLayoutType as jest.Mock;

window.history.pushState({}, 'Workspace Overlay', '/workspace-overlay');

describe('WorkspaceOverlay', () => {
  beforeAll(() => {
    registerWorkspace({
      name: 'Patient Search',
      title: 'Patient Search',
      load: jest.fn().mockResolvedValue({ result: 'hey' }),
      moduleName: '@openmrs/foo',
    });
  });

  it('renders the desktop version of the overlay', async () => {
    mockedUseLayoutType.mockReturnValue('small-desktop');
    act(() => launchWorkspace('Patient Search', { workspaceTitle: 'Test Header' }));
    renderWorkspaceOverlay();

    expect(await screen.findByText('Test Header')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    const container = screen.getByRole('complementary');
    expect(container).toHaveClass('desktopOverlay');
  });

  it('renders the tablet version of the overlay', async () => {
    mockedUseLayoutType.mockReturnValue('tablet');
    act(() => launchWorkspace('Patient Search'));
    renderWorkspaceOverlay();

    expect(await screen.findByText('Patient Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    const container = screen.getByRole('complementary');
    expect(container).toHaveClass('tabletOverlay');
  });

  it('opens with overridable title and closes', async () => {
    mockedUseLayoutType.mockReturnValue('small-desktop');
    const user = userEvent.setup();
    act(() => launchWorkspace('Patient Search', { workspaceTitle: 'Make an appointment' }));
    renderWorkspaceOverlay();

    expect(screen.queryByRole('complementary')).toBeInTheDocument();
    expect(screen.getByText('Make an appointment')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
});

function renderWorkspaceOverlay() {
  render(<WorkspaceOverlay contextKey="workspace-overlay" />);
}
