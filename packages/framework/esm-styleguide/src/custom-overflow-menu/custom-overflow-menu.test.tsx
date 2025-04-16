import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { CustomOverflowMenu } from './custom-overflow-menu.component';

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
    expect(trigger).toHaveAttribute('aria-controls', 'custom-actions-overflow-menu');
    expect(menu).toHaveAttribute('aria-labelledby', 'custom-actions-overflow-menu-trigger');
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
