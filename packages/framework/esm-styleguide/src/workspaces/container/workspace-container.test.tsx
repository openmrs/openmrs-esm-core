/// <reference path="../../../setupTests.ts" />
import React from 'react';
import { act, screen, renderHook, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerWorkspace } from '@openmrs/esm-extensions';
import { ComponentContext, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import { type DefaultWorkspaceProps, WorkspaceContainer, launchWorkspace, useWorkspaces } from '..';

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

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn().mockImplementation(() => ({ t: (arg: string) => arg })),
}));

const mockIsDesktop = jest.mocked(isDesktop);
const mockUseLayoutType = jest.mocked(useLayoutType);

window.history.pushState({}, 'Workspace Container', '/workspace-container');

jest.mock('single-spa-react/parcel', () => jest.fn().mockImplementation(() => <div>Parcel</div>));

interface ClinicalFormWorkspaceProps extends DefaultWorkspaceProps {
  patientUuid: string;
}

describe('WorkspaceContainer in window mode', () => {
  beforeAll(() => {
    registerWorkspace({
      name: 'clinical-form',
      title: 'clinicalForm',
      load: jest.fn(),
      moduleName: '@openmrs/foo',
      canHide: true,
      canMaximize: true,
    });

    registerWorkspace({
      name: 'order-basket',
      title: 'orderBasket',
      load: jest.fn(),
      moduleName: '@openmrs/bar',
      canHide: true,
      canMaximize: true,
    });
  });

  test('should translate the workspace title inside the workspace container', () => {
    mockIsDesktop.mockReturnValue(true);
    renderWorkspaceWindow();
    act(() => launchWorkspace('clinical-form'));

    let header = screen.getByRole('banner');
    expect(within(header).getByText('clinicalForm')).toBeInTheDocument();

    act(() => launchWorkspace('order-basket'));

    header = screen.getByRole('banner');
    expect(within(header).getByText('orderBasket')).toBeInTheDocument();
  });

  test('should override title via additional props and via setTitle', async () => {
    mockIsDesktop.mockReturnValue(true);
    renderWorkspaceWindow();
    // In this line we are also verifying that the type argument to `launchWorkspace`
    // behaves as expected, constraining the type of the `additionalProps` argument.

    act(() =>
      launchWorkspace<ClinicalFormWorkspaceProps>('clinical-form', {
        workspaceTitle: 'COVID Admission',
        patientUuid: '123',
      }),
    );

    const header = screen.getByRole('banner');
    expect(within(header).getByText('COVID Admission')).toBeInTheDocument();

    const utils = renderHook(() => useWorkspaces());
    act(() => utils.result.current.workspaces[0].setTitle('COVID Discharge'));

    expect(within(header).getByText('COVID Discharge')).toBeInTheDocument();

    act(() =>
      utils.result.current.workspaces[0].setTitle('Space Ghost', <div data-testid="patient-name">Space Ghost</div>),
    );
    expect(within(header).getByTestId('patient-name')).toBeInTheDocument();
  });

  test('re-launching workspace should update title, but only if setTitle was not used', async () => {
    mockIsDesktop.mockReturnValue(true);
    renderWorkspaceWindow();

    // In this line we are also testing that `launchWorkspace` allows arbitrary additional props
    // when no type argument is provided.

    act(() => launchWorkspace('clinical-form', { workspaceTitle: 'COVID Admission', foo: 'bar' }));

    const header = screen.getByRole('banner');
    expect(within(header).getByText('COVID Admission')).toBeInTheDocument();

    act(() => launchWorkspace('clinical-form', { workspaceTitle: 'COVID Discharge' }));
    expect(within(header).getByText('COVID Discharge')).toBeInTheDocument();

    const utils = renderHook(() => useWorkspaces());
    act(() => utils.result.current.workspaces[0].setTitle('Fancy Special Title'));
    expect(within(header).getByText('Fancy Special Title')).toBeInTheDocument();

    act(() => launchWorkspace('clinical-form', { workspaceTitle: 'COVID Admission Again' }));
    expect(within(header).getByText('Fancy Special Title')).toBeInTheDocument();
  });

  test('should reopen hidden workspace window when user relaunches the same workspace window', async () => {
    const user = userEvent.setup();
    const utils = renderHook(() => useWorkspaces());
    mockIsDesktop.mockReturnValue(true);

    expect(utils.result.current.workspaces.length).toBe(0);

    renderWorkspaceWindow();

    act(() => launchWorkspace('clinical-form', { workspaceTitle: 'POC Triage' }));

    expect(utils.result.current.workspaces.length).toBe(1);

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
    expect(utils.result.current.workspaces.length).toBe(1);
    input = screen.getByRole('textbox');
    expect(input).toHaveValue("what's good");
  });

  test('should toggle between maximized and normal screen size', async () => {
    const user = userEvent.setup();
    mockIsDesktop.mockReturnValue(true);
    renderWorkspaceWindow();

    act(() => launchWorkspace('clinical-form'));

    const header = screen.getByRole('banner');
    expect(within(header).getByText('clinicalForm')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByRole('complementary').firstChild).not.toHaveClass('maximizedWindow');

    const maximizeButton = await screen.findByRole('button', { name: 'Maximize' });
    await user.click(maximizeButton);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByRole('complementary').firstChild).toHaveClass('maximizedWindow');

    const minimizeButton = await screen.findByRole('button', { name: 'Minimize' });
    await user.click(minimizeButton);
    // eslint-disable-next-line testing-library/no-node-access
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
    mockUseLayoutType.mockReturnValue('small-desktop');
    const user = userEvent.setup();

    renderWorkspaceOverlay();
    act(() => launchWorkspace('patient-search', { workspaceTitle: 'Make an appointment' }));

    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expectToBeVisible(screen.getByRole('complementary'));
    expect(screen.getByText('Make an appointment')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);
    expect(screen.getByRole('complementary')).toHaveClass('hiddenRelative');
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
