import React from 'react';
import { screen, render, within, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentContext, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import { WorkspaceContainer, launchWorkspace, registerWorkspace, useWorkspaces } from '..';

jest.mock('./workspace-renderer.component.tsx', () => {
  return {
    WorkspaceRenderer: ({ workspace }) => (
      <div>
        <p>{workspace.name}</p>
        <input></input>
      </div>
    ),
  };
});

const mockedIsDesktop = isDesktop as jest.Mock;
const mockedUseLayoutType = useLayoutType as jest.Mock;

window.history.pushState({}, 'Workspace Container', '/workspace-container');

jest.mock('single-spa-react/parcel', () => jest.fn().mockImplementation(() => <div>Parcel</div>));
jest.mock('@openmrs/esm-translations', () => {
  const originalModule = jest.requireActual('@openmrs/esm-translations');

  return {
    ...originalModule,
    translateFrom: (module, key, defaultValue, options) => defaultValue,
  };
});

describe('WorkspaceContainer in window mode', () => {
  beforeAll(() => {
    registerWorkspace({
      name: 'clinical-form',
      title: 'Clinical Form',
      load: jest.fn(),
      moduleName: '@openmrs/foo',
      canHide: true,
      canMaximize: true,
    });

    registerWorkspace({
      name: 'order-basket',
      title: 'Order Basket',
      load: jest.fn(),
      moduleName: '@openmrs/bar',
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

    act(() => launchWorkspace('clinical-form', { workspaceTitle: 'POC Triage' }));
    expect(workspaces.result.current.workspaces.length).toBe(1);
    const header = screen.getByRole('banner');
    expect(within(header).getByText('POC Triage')).toBeInTheDocument();
    expectToBeVisible(screen.getByRole('complementary'));
    let input = screen.getByRole('textbox');
    await user.type(input, "what's good");

    const hideButton = screen.getByRole('button', { name: 'Hide' });
    await user.click(hideButton);
    expect(screen.queryByRole('complementary')).toHaveClass('hiddenRelative');

    act(() => launchWorkspace('clinical-form', { workspaceTitle: 'POC Triage' }));
    expectToBeVisible(await screen.findByRole('complementary'));
    expect(screen.queryByRole('complementary')).not.toHaveClass('hiddenRelative');
    expect(screen.queryByRole('complementary')).not.toHaveClass('hiddenFixed');
    expect(workspaces.result.current.workspaces.length).toBe(1);
    input = screen.getByRole('textbox');
    expect(input).toHaveValue("what's good");
  });

  test('should toggle between maximized and normal screen size', async () => {
    const user = userEvent.setup();
    mockedIsDesktop.mockReturnValue(true);
    renderWorkspaceWindow();

    act(() => launchWorkspace('clinical-form'));
    const header = screen.getByRole('banner');
    expect(within(header).getByText('Clinical Form')).toBeInTheDocument();
    expect(screen.getByRole('complementary').firstChild).not.toHaveClass('maximizedWindow');

    const maximizeButton = await screen.findByRole('button', { name: 'Maximize' });
    await user.click(maximizeButton);
    expect(screen.getByRole('complementary').firstChild).toHaveClass('maximizedWindow');

    const minimizeButton = await screen.findByRole('button', { name: 'Minimize' });
    await user.click(minimizeButton);
    expect(screen.getByRole('complementary').firstChild).not.toHaveClass('maximizedWindow');
  });

  // This would be a nice test if it worked, but it seems there are important differences between
  // the React DOM and Jest DOM that cause this to fail when it should be working.
  // This logic should be tested in the E2E tests.
  // Try this again periodically to see if it starts working.
  xtest("shouldn't lose data when transitioning between workspaces", async () => {
    renderWorkspaceWindow();
    const user = userEvent.setup();
    act(() => launchWorkspace('clinical-form'));
    let container = screen.getByRole('complementary');
    expect(within(container).getByText('clinical-form')).toBeInTheDocument();
    let input = screen.getByRole('textbox');
    await user.type(input, 'howdy');

    await user.click(screen.getByRole('button', { name: 'Hide' }));
    act(() => launchWorkspace('order-basket'));
    container = screen.getByRole('complementary');
    expect(within(container).getByText('order-basket')).toBeInTheDocument();

    act(() => launchWorkspace('clinical-form'));
    expect(within(container).getByText('clinical-form')).toBeInTheDocument();
    input = screen.getByRole('textbox');
    expect(input).toHaveValue('howdy');
  });
});

function renderWorkspaceWindow() {
  render(
    <ComponentContext.Provider value={{ featureName: 'test', moduleName: '@openmrs/foo' }}>
      <WorkspaceContainer contextKey="workspace-container" />
    </ComponentContext.Provider>,
  );
}

describe('WorkspaceContainer in overlay mode', () => {
  beforeAll(() => {
    registerWorkspace({
      name: 'patient-search',
      title: 'Patient Search',
      load: jest.fn(),
      moduleName: '@openmrs/foo',
    });
  });

  it('opens with overridable title and closes', async () => {
    mockedUseLayoutType.mockReturnValue('small-desktop');
    const user = userEvent.setup();
    act(() => launchWorkspace('patient-search', { workspaceTitle: 'Make an appointment' }));
    renderWorkspaceOverlay();

    expect(screen.queryByRole('complementary')).toBeInTheDocument();
    expectToBeVisible(screen.getByRole('complementary'));
    expect(screen.getByText('Make an appointment')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);
    expect(screen.queryByRole('complementary')).toHaveClass('hiddenRelative');
  });
});

function renderWorkspaceOverlay() {
  render(
    <ComponentContext.Provider value={{ featureName: 'test', moduleName: '@openmrs/foo' }}>
      <WorkspaceContainer overlay contextKey="workspace-container" />
    </ComponentContext.Provider>,
  );
}

function expectToBeVisible(element: HTMLElement) {
  expect(element).toBeVisible();
  expect(element).not.toHaveClass('hiddenRelative');
  expect(element).not.toHaveClass('hiddenFixed');
  expect(element).not.toHaveClass('hidden');
}
