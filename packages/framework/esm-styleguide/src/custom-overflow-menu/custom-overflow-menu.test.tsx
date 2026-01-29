import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { CustomOverflowMenu, CustomOverflowMenuItem, useCustomOverflowMenu } from './custom-overflow-menu.component';

const mockUseLayoutType = vi.mocked(useLayoutType);

describe('CustomOverflowMenu', () => {
  beforeEach(() => {
    mockUseLayoutType.mockReturnValue('small-desktop');
  });

  it('should render', () => {
    render(<CustomOverflowMenu menuTitle="Test Menu" children={<li>Option 1</li>} />);
    expect(screen.getByRole('button', { name: /test menu/i })).toBeInTheDocument();
  });

  it('should toggle menu on trigger button click', async () => {
    const user = userEvent.setup();

    render(
      <CustomOverflowMenu menuTitle="Menu">
        <li>Option 1</li>
        <li>Option 2</li>
      </CustomOverflowMenu>,
    );

    const triggerButton = screen.getByRole('button', { name: /menu/i });

    await user.click(triggerButton);
    expect(triggerButton).toHaveAttribute('aria-expanded', 'true');

    await user.click(triggerButton);
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should render children within the menu', async () => {
    const user = userEvent.setup();

    render(
      <CustomOverflowMenu menuTitle="Menu">
        <li role="menuitem">Option 1</li>
        <li role="menuitem">Option 2</li>
      </CustomOverflowMenu>,
    );

    await user.click(screen.getByRole('button'));

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent('Option 1');
    expect(menuItems[1]).toHaveTextContent('Option 2');
  });

  it('should apply tablet-specific styling when on tablet layout', () => {
    mockUseLayoutType.mockReturnValue('tablet');

    render(
      <CustomOverflowMenu menuTitle="Menu">
        <li>Option 1</li>
      </CustomOverflowMenu>,
    );

    expect(screen.getByRole('list')).toHaveClass('cds--overflow-menu-options--lg');
  });

  it('should have correct ARIA attributes', () => {
    render(
      <CustomOverflowMenu menuTitle="Menu">
        <li>Option 1</li>
      </CustomOverflowMenu>,
    );

    const trigger = screen.getByRole('button');
    const menu = screen.getByRole('menu');

    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const menuId = trigger.getAttribute('aria-controls');
    expect(menuId).toBeTruthy();
    expect(menu).toHaveAttribute('id', menuId);
    expect(menu).toHaveAttribute('aria-labelledby', trigger.id);
  });

  it('should generate unique IDs for multiple instances', () => {
    render(
      <>
        <CustomOverflowMenu menuTitle="Menu A">
          <li>Option 1</li>
        </CustomOverflowMenu>
        <CustomOverflowMenu menuTitle="Menu B">
          <li>Option 2</li>
        </CustomOverflowMenu>
      </>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0].id).not.toBe(buttons[1].id);
  });

  it('should close menu and return focus to trigger on Escape key', async () => {
    const user = userEvent.setup();

    render(
      <CustomOverflowMenu menuTitle="Menu">
        <CustomOverflowMenuItem itemText="Option 1" />
      </CustomOverflowMenu>,
    );

    const trigger = screen.getByRole('button', { name: /menu/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('should focus the first enabled menu item when opened', async () => {
    const user = userEvent.setup();

    render(
      <CustomOverflowMenu menuTitle="Menu">
        <CustomOverflowMenuItem itemText="Disabled Item" disabled />
        <CustomOverflowMenuItem itemText="Enabled Item" />
      </CustomOverflowMenu>,
    );

    await user.click(screen.getByRole('button', { name: /menu/i }));

    const menuItems = screen.getAllByRole('menuitem');
    await waitFor(() => expect(menuItems[1]).toHaveFocus());
  });

  it('should have correct menu positioning attributes', () => {
    render(
      <CustomOverflowMenu menuTitle="Menu">
        <li>Option 1</li>
      </CustomOverflowMenu>,
    );

    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('data-floating-menu-direction', 'bottom');
  });
});

describe('CustomOverflowMenuItem', () => {
  beforeEach(() => {
    mockUseLayoutType.mockReturnValue('small-desktop');
  });

  it('should render within CustomOverflowMenu', async () => {
    render(
      <CustomOverflowMenu menuTitle="Menu">
        <CustomOverflowMenuItem itemText="Test Item" />
      </CustomOverflowMenu>,
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('should close menu when clicked', async () => {
    const user = userEvent.setup();

    render(
      <CustomOverflowMenu menuTitle="Menu">
        <CustomOverflowMenuItem itemText="Click Me" />
      </CustomOverflowMenu>,
    );

    const triggerButton = screen.getByRole('button', { name: /menu/i });

    // Open the menu
    await user.click(triggerButton);
    expect(triggerButton).toHaveAttribute('aria-expanded', 'true');

    // Click the menu item
    await user.click(screen.getByText('Click Me'));
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('useCustomOverflowMenu', () => {
  it('should throw error when used outside CustomOverflowMenu', () => {
    const TestComponent = () => {
      useCustomOverflowMenu();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow('useCustomOverflowMenu must be used within a CustomOverflowMenu');
  });
});
