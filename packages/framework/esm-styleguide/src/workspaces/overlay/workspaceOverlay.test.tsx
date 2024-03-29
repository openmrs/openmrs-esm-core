import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useLayoutType, isDesktop } from '@openmrs/esm-framework';
import Overlay from './overlay.component';

const mockUseLayoutType = useLayoutType as jest.Mock;
const mockIsDesktop = isDesktop as jest.Mock;

jest.mock('@openmrs/esm-framework');

const headerText = 'Test Header';

describe('Overlay Component', () => {
  it('renders desktop layout with close button', async () => {
    const user = userEvent.setup();
    const closePanelMock = jest.fn();

    mockIsDesktop.mockImplementation(() => true);

    render(<Overlay closePanel={closePanelMock} header={headerText} />);

    const headerContent = screen.getByText(headerText);
    const closeButton = screen.getByLabelText('Close overlay');

    expect(headerContent).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(closePanelMock).toHaveBeenCalled();
  });

  it('renders tablet layout with back arrow button and the children', () => {
    const closePanelMock = jest.fn();
    mockIsDesktop.mockImplementation(() => false);
    mockUseLayoutType.mockImplementation(() => 'tablet');

    render(
      <Overlay closePanel={closePanelMock} header={headerText}>
        <div>Something</div>
      </Overlay>,
    );

    const headerContent = screen.getByText(headerText);
    const backButton = screen.getByText('Close overlay');

    expect(headerContent).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    expect(screen.getByText('Something')).toBeInTheDocument();
  });
});
