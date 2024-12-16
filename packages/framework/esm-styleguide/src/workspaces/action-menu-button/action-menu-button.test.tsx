import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pen } from '@carbon/react/icons';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { ActionMenuButton } from './action-menu-button.component';
import { type OpenWorkspace, useWorkspaces, type WorkspacesInfo } from '../workspaces';

const mockUseLayoutType = jest.mocked(useLayoutType);
const mockUseWorkspaces = jest.mocked(useWorkspaces);

jest.mock('@carbon/react/icons', () => ({
  ...jest.requireActual('@carbon/react/icons'),
  Pen: jest.fn(({ size }) => <div data-testid="pen-icon">size: {size}</div>),
}));

jest.mock('@openmrs/esm-react-utils', () => {
  const originalModule = jest.requireActual('@openmrs/esm-react-utils');

  return {
    ...originalModule,
    useLayoutType: jest.fn(),
  };
});

jest.mock('../workspaces', () => {
  const originalModule = jest.requireActual('../workspaces');

  return {
    ...originalModule,
    useWorkspaces: jest.fn(),
  };
});

describe('ActionMenuButton', () => {
  it('should display tablet view', async () => {
    const user = userEvent.setup();

    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('tablet');

    const handler = jest.fn();

    render(
      <ActionMenuButton
        getIcon={(props) => <Pen {...props} />}
        label={'Visit note'}
        iconDescription={'Note'}
        handler={handler}
        type={'visit-note'}
      />,
    );

    expect(screen.getByTestId('pen-icon')).toBeInTheDocument();
    expect(screen.getByTestId('pen-icon').innerHTML).toBe('size: 16');

    const button = screen.getByRole('button', { name: /Visit note/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(handler).toHaveBeenCalled();
    expect(button).not.toHaveClass('active');
  });

  it('should have not active className if workspace is not active', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'order' }, { type: 'visit-note' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('tablet');

    const handler = jest.fn();

    render(
      <ActionMenuButton
        getIcon={(props) => <Pen {...props} />}
        label={'Visit note'}
        iconDescription={'Note'}
        handler={handler}
        type={'visit-note'}
      />,
    );

    const button = screen.getByRole('button', { name: /Visit note/i });
    expect(button).toBeInTheDocument();

    expect(button).not.toHaveClass('active');
  });

  it('should have active className if workspace is active', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('tablet');

    const handler = jest.fn();

    render(
      <ActionMenuButton
        getIcon={(props) => <Pen {...props} />}
        label={'Visit note'}
        iconDescription={'Note'}
        handler={handler}
        type={'visit-note'}
      />,
    );

    const button = screen.getByRole('button', { name: /Visit note/i });
    expect(button).toBeInTheDocument();

    expect(button).toHaveClass('active');
  });

  it('should not display active className if workspace is active but workspace window is hidden', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'hidden',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('tablet');

    const handler = jest.fn();

    render(
      <ActionMenuButton
        getIcon={(props) => <Pen {...props} />}
        label={'Visit note'}
        iconDescription={'Note'}
        handler={handler}
        type={'visit-note'}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    expect(button).not.toHaveClass('active');
  });

  it('should display desktop view', async () => {
    const user = userEvent.setup();

    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('small-desktop');

    const handler = jest.fn();

    render(
      <ActionMenuButton
        getIcon={(props) => <Pen {...props} />}
        label={'Visit note'}
        iconDescription={'Note'}
        handler={handler}
        type={'visit-note'}
      />,
    );

    expect(screen.getByTestId('pen-icon')).toBeInTheDocument();
    expect(screen.getByTestId('pen-icon').innerHTML).toBe('size: 16');

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(handler).toHaveBeenCalled();

    expect(button).not.toHaveClass('active');
  });

  it('should display have active className if workspace is not active', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'order' }, { type: 'visit-note' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('small-desktop');

    const handler = jest.fn();

    render(
      <ActionMenuButton
        getIcon={(props) => <Pen {...props} />}
        label={'Visit note'}
        iconDescription={'Note'}
        handler={handler}
        type={'visit-note'}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    expect(button).not.toHaveClass('active');
  });

  it('should display active className if workspace is active and workspace window is normal', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('small-desktop');

    const handler = jest.fn();

    render(
      <ActionMenuButton
        getIcon={(props) => <Pen {...props} />}
        label={'Visit note'}
        iconDescription={'Note'}
        handler={handler}
        type={'visit-note'}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    expect(button).toHaveClass('active');
  });

  it('should not display active className if workspace is active but workspace window is hidden', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'hidden',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('small-desktop');

    const handler = jest.fn();

    render(
      <ActionMenuButton
        getIcon={(props) => <Pen {...props} />}
        label={'Visit note'}
        iconDescription={'Note'}
        handler={handler}
        type={'visit-note'}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    expect(button).not.toHaveClass('active');
  });
});
