import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentContext, useLayoutType } from '@openmrs/esm-react-utils';
import { type OpenedWindow } from '@openmrs/esm-extensions';
import { launchWorkspace2, useWorkspace2Store } from '../workspace2';
import { ActionMenuButton2 } from './action-menu-button2.component';

vi.mock('../workspace2', () => ({
  launchWorkspace2: vi.fn(),
  useWorkspace2Store: vi.fn(),
}));

vi.mock('@openmrs/esm-react-utils', async () => ({
  ...(await vi.importActual<object>('@openmrs/esm-react-utils')),
  useLayoutType: vi.fn(),
}));

const mockUseLayoutType = vi.mocked(useLayoutType);
const mockUseWorkspace2Store = vi.mocked(useWorkspace2Store);
const mockLaunchWorkspace2 = vi.mocked(launchWorkspace2);

const openedWindows = [{ windowName: 'test-window', openedWorkspaces: [] }] as unknown as Array<OpenedWindow>;

function renderButton(props: Partial<React.ComponentProps<typeof ActionMenuButton2>> = {}) {
  return render(
    <ComponentContext.Provider value={{ extension: { extensionId: 'test-window' } } as any}>
      <ActionMenuButton2
        icon={() => <svg data-testid="icon" />}
        label="Test button"
        workspaceToLaunch={{ workspaceName: 'test-workspace' }}
        {...props}
      />
    </ComponentContext.Provider>,
  );
}

describe('ActionMenuButton2 hidden and disabled', () => {
  beforeEach(() => {
    mockUseLayoutType.mockReturnValue('small-desktop');
    mockUseWorkspace2Store.mockReturnValue({
      openedWindows,
      restoreWindow: vi.fn(),
      hideWindow: vi.fn(),
      isMostRecentlyOpenedWindowHidden: false,
    } as any);
  });

  it('renders an enabled button by default', () => {
    renderButton();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('renders nothing when hidden returns true, passing openedWindows', () => {
    const hidden = vi.fn().mockReturnValue(true);
    renderButton({ hidden });
    expect(hidden).toHaveBeenCalledWith(openedWindows);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the button when hidden returns false', () => {
    renderButton({ hidden: () => false });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('disables the button when disabled returns true, passing openedWindows', async () => {
    const disabled = vi.fn().mockReturnValue(true);
    renderButton({ disabled });
    expect(disabled).toHaveBeenCalledWith(openedWindows);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(mockLaunchWorkspace2).not.toHaveBeenCalled();
  });

  it('keeps the button enabled when disabled returns false', () => {
    renderButton({ disabled: () => false });
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('supports hidden and disabled on tablet layout', () => {
    mockUseLayoutType.mockReturnValue('tablet');
    const { unmount } = renderButton({ disabled: () => true });
    expect(screen.getByRole('button')).toBeDisabled();
    unmount();

    renderButton({ hidden: () => true });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
