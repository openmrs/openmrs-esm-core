import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CustomOverflowMenuComponent from './overflow-menu.component';

describe('CustomOverflowMenuComponent', () => {
  it('should render', () => {
    render(<CustomOverflowMenuComponent menuTitle="Test Menu" dropDownMenu={true} children={<li>Option 1</li>} />);
    expect(screen.getByRole('button', { name: 'Test Menu' })).toBeInTheDocument();
  });

  it('should toggle menu on trigger button click', async () => {
    const user = userEvent.setup();

    render(
      <CustomOverflowMenuComponent menuTitle="Menu" dropDownMenu={false}>
        <li>Option 1</li>
        <li>Option 2</li>
      </CustomOverflowMenuComponent>,
    );

    const triggerButton = screen.getByRole('button', { name: /menu/i });

    await user.click(triggerButton);
    expect(triggerButton.getAttribute('aria-expanded')).toBe('true');

    await user.click(triggerButton);
    expect(triggerButton.getAttribute('aria-expanded')).toBe('false');
  });
});
