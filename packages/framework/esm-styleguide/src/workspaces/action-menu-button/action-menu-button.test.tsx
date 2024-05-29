import React from 'react';
import { screen, render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { Pen } from '@carbon/react/icons';
import { ActionMenuButton } from './action-menu-button.component';
import { useWorkspaces } from '../workspaces';

const mockedUseLayoutType = useLayoutType as jest.Mock;

jest.mock('@carbon/react/icons', () => ({
  ...(jest.requireActual('@carbon/react/icons') as jest.Mock),
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
  beforeEach(cleanup);

  it('should display tablet view', async () => {
    const user = userEvent.setup();

    (useWorkspaces as jest.Mock).mockReturnValue({
      workspaces: [{ type: 'order' }],
      workspaceWindowState: 'normal',
    });

    mockedUseLayoutType.mockReturnValue('tablet');

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
    expect(handler).toBeCalled();

    expect(button).not.toHaveClass('active');
  });

  it('should have not active className if workspace is not active', async () => {
    (useWorkspaces as jest.Mock).mockReturnValue({
      workspaces: [{ type: 'order' }, { type: 'visit-note' }],
      workspaceWindowState: 'normal',
    });

    mockedUseLayoutType.mockReturnValue('tablet');

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
    (useWorkspaces as jest.Mock).mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' }],
      workspaceWindowState: 'normal',
    });

    mockedUseLayoutType.mockReturnValue('tablet');

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
    (useWorkspaces as jest.Mock).mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' }],
      workspaceWindowState: 'hidden',
    });

    mockedUseLayoutType.mockReturnValue('tablet');

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

    (useWorkspaces as jest.Mock).mockReturnValue({
      workspaces: [{ type: 'order' }],
      workspaceWindowState: 'normal',
    });

    mockedUseLayoutType.mockReturnValue('small-desktop');

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
    expect(handler).toBeCalled();

    expect(button).not.toHaveClass('active');
  });

  it('should display have active className if workspace is not active', async () => {
    (useWorkspaces as jest.Mock).mockReturnValue({
      workspaces: [{ type: 'order' }, { type: 'visit-note' }],
      workspaceWindowState: 'normal',
    });

    mockedUseLayoutType.mockReturnValue('small-desktop');

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
    (useWorkspaces as jest.Mock).mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' }],
      workspaceWindowState: 'normal',
    });

    mockedUseLayoutType.mockReturnValue('small-desktop');

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
    (useWorkspaces as jest.Mock).mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' }],
      workspaceWindowState: 'hidden',
    });

    mockedUseLayoutType.mockReturnValue('small-desktop');

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
