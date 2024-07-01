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
      name: 'Clinical Form',
      title: 'Clinical Form',
      load: jest.fn(),
      moduleName: '@openmrs/foo',
      canHide: true,
      canMaximize: true,
    });

    registerWorkspace({
      name: 'Order Basket',
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

    act(() => launchWorkspace('Clinical Form', { workspaceTitle: 'POC Triage' }));
    expect(workspaces.result.current.workspaces.length).toBe(1);
    const header = screen.getByRole('banner');
    expect(within(header).getByText('POC Triage')).toBeInTheDocument();
    expectToBeVisible(screen.getByRole('complementary'));

    const hideButton = screen.getByRole('button', { name: 'Hide' });
    await user.click(hideButton);
    expect(screen.queryByRole('complementary')).toHaveClass('hiddenRelative');

    act(() => launchWorkspace('Clinical Form', { workspaceTitle: 'POC Triage' }));
    expectToBeVisible(await screen.findByRole('complementary'));
    expect(screen.queryByRole('complementary')).not.toHaveClass('hiddenRelative');
    expect(screen.queryByRole('complementary')).not.toHaveClass('hiddenFixed');
    expect(workspaces.result.current.workspaces.length).toBe(1);
  });

  test('should toggle between maximized and normal screen size', async () => {
    const user = userEvent.setup();
    mockedIsDesktop.mockReturnValue(true);
    renderWorkspaceWindow();

    act(() => launchWorkspace('Clinical Form'));
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

  test("shouldn't lose data when transitioning between workspaces", async () => {
    renderWorkspaceWindow();
    const user = userEvent.setup();
    act(() => launchWorkspace('Clinical Form'));
    let container = screen.getByRole('complementary');
    expect(within(container).getByText('Clinical Form')).toBeInTheDocument();
    let input = screen.getByRole('textbox');
    await user.type(input, 'hello');

    await user.click(screen.getByRole('button', { name: 'Minimize' }));
    act(() => launchWorkspace('Order Basket'));
    container = screen.getByRole('complementary');
    expect(within(container).getByText('Order Basket')).toBeInTheDocument();

    act(() => launchWorkspace('Clinical Form'));
    expect(within(container).getByText('Clinical Form')).toBeInTheDocument();
    input = screen.getByRole('textbox');
    expect(input).toHaveValue('hello');
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
      name: 'Patient Search',
      title: 'Patient Search',
      load: jest.fn().mockResolvedValue({ result: 'hey' }),
      moduleName: '@openmrs/foo',
    });
  });

  it('opens with overridable title and closes', async () => {
    mockedUseLayoutType.mockReturnValue('small-desktop');
    const user = userEvent.setup();
    act(() => launchWorkspace('Patient Search', { workspaceTitle: 'Make an appointment' }));
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
import '@testing-library/jest-dom';
import { WorkspaceRenderer } from './workspace-renderer.component';

function expectToBeVisible(element: HTMLElement) {
  expect(element).toBeVisible();
  expect(element).not.toHaveClass('hiddenRelative');
  expect(element).not.toHaveClass('hiddenFixed');
  expect(element).not.toHaveClass('hidden');
}
