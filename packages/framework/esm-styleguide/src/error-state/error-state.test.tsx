import React from 'react';
import { render, screen } from '@testing-library/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { ErrorState } from '.';

const mockUseLayoutType = jest.mocked(useLayoutType);

describe('ErrorState', () => {
  it('renders an error state widget card', () => {
    const testError = {
      response: {
        status: 500,
        statusText: 'Internal Server Error',
      },
    };
    render(<ErrorState headerTitle="appointments" error={testError} />);

    expect(screen.getByRole('heading', { name: /appointments/i })).toBeInTheDocument();
    expect(screen.getByText(/Error 500: Internal Server Error/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above./i,
      ),
    ).toBeInTheDocument();
  });

  it('should render tablet layout when layout type is tablet', () => {
    mockUseLayoutType.mockReturnValue('tablet');

    render(<ErrorState headerTitle="test" error={{}} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByRole('heading').parentElement).toHaveClass('tabletHeading');
  });

  it('should render desktop layout when layout type is not tablet', () => {
    mockUseLayoutType.mockReturnValue('small-desktop');

    render(<ErrorState headerTitle="test" error={{}} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByRole('heading').parentElement).toHaveClass('desktopHeading');
  });

  it('should handle error with partial response data', () => {
    const error = { response: { status: 404 } };
    render(<ErrorState headerTitle="test" error={error} />);
    expect(screen.getByText(/Error 404:/i)).toBeInTheDocument();
  });
});
