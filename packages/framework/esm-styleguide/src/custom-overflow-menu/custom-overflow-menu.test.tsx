import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { CustomOverflowMenu } from './custom-overflow-menu.component';

describe('CustomOverflowMenuComponent', () => {
  it('should render', () => {
    render(<CustomOverflowMenu menuTitle="Test Menu" children={<li>Option 1</li>} />);
    expect(screen.getByRole('button', { name: 'Test Menu' })).toBeInTheDocument();
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
    expect(triggerButton.getAttribute('aria-expanded')).toBe('true');

    await user.click(triggerButton);
    expect(triggerButton.getAttribute('aria-expanded')).toBe('false');
  });
});
