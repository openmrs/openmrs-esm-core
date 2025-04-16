import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pen } from '@carbon/react/icons';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { ActionMenuButton } from './action-menu-button.component';
import { type OpenWorkspace, useWorkspaces, type WorkspacesInfo } from '../workspaces';

const mockUseLayoutType = vi.mocked(useLayoutType);
const mockUseWorkspaces = vi.mocked(useWorkspaces);

vi.mock('@carbon/react/icons', async () => ({
  ...(await vi.importActual('@carbon/react/icons')),
  Pen: vi.fn(({ size }) => <div data-testid="pen-icon">size: {size}</div>),
}));

vi.mock('@openmrs/esm-react-utils', async () => {
  const originalModule = await vi.importActual('@openmrs/esm-react-utils');

  return {
    ...originalModule,
    useLayoutType: vi.fn(),
  };
});

vi.mock('../workspaces', async () => {
  const originalModule = await vi.importActual('../workspaces');

  return {
    ...originalModule,
    useWorkspaces: vi.fn(),
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

    const handler = vi.fn();

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
    expect(button.getAttribute('class')).not.toContain('active');
  });

  it('should have not active className if workspace is not active', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'order' }, { type: 'visit-note' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('tablet');

    const handler = vi.fn();

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

    expect(button.getAttribute('class')).not.toContain('active');
  });

  it('should have active className if workspace is active', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('tablet');

    const handler = vi.fn();

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

    // toHaveAttribute() cannot do either partial or regex matches
    // eslint-disable-next-line jest-dom/prefer-to-have-attribute
    expect(button.getAttribute('class')).toContain('active');
  });

  it('should not display active className if workspace is active but workspace window is hidden', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'hidden',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('tablet');

    const handler = vi.fn();

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

    expect(button.getAttribute('class')).not.toContain('active');
  });

  it('should display desktop view', async () => {
    const user = userEvent.setup();

    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('small-desktop');

    const handler = vi.fn();

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

    expect(button.getAttribute('class')).not.toContain('active');
  });

  it('should display have active className if workspace is not active', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'order' }, { type: 'visit-note' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('small-desktop');

    const handler = vi.fn();

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

    expect(button.getAttribute('class')).not.toContain('active');
  });

  it('should display active className if workspace is active and workspace window is normal', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'normal',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('small-desktop');

    const handler = vi.fn();

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

    // toHaveAttribute() cannot do either partial or regex matches
    // eslint-disable-next-line jest-dom/prefer-to-have-attribute
    expect(button.getAttribute('class')).toContain('active');
  });

  it('should not display active className if workspace is active but workspace window is hidden', async () => {
    mockUseWorkspaces.mockReturnValue({
      workspaces: [{ type: 'visit-note' }, { type: 'order' } as unknown as OpenWorkspace],
      workspaceWindowState: 'hidden',
    } as unknown as WorkspacesInfo);

    mockUseLayoutType.mockReturnValue('small-desktop');

    const handler = vi.fn();

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

    expect(button.getAttribute('class')).not.toContain('active');
  });
});
