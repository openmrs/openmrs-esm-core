import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { CustomOverflowMenu } from './custom-overflow-menu.component';
import { useLayoutType } from '@openmrs/esm-react-utils';

const mockUseLayoutType = jest.mocked(useLayoutType);

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
    expect(triggerButton).toHaveAttribute('aria-expanded', 'true');

    await user.click(triggerButton);
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should apply deceased styling when deceased prop is true', () => {
    render(
      <CustomOverflowMenu menuTitle="Menu" deceased={true}>
        <li>Option 1</li>
      </CustomOverflowMenu>,
    );

    expect(screen.getByRole('button')).toHaveClass('deceased');
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
});
