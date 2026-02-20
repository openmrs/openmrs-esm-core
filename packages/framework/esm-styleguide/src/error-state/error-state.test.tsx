import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { ErrorState } from '.';

const mockUseLayoutType = vi.mocked(useLayoutType);

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
    expect(screen.getByRole('heading').parentElement?.getAttribute('class')).toContain('tabletHeader');
  });

  it('should render desktop layout when layout type is not tablet', () => {
    mockUseLayoutType.mockReturnValue('small-desktop');

    render(<ErrorState headerTitle="test" error={{}} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByRole('heading').parentElement?.getAttribute('class')).toContain('desktopHeader');
  });

  it('should handle error with partial response data', () => {
    const error = { response: { status: 404 } };
    render(<ErrorState headerTitle="test" error={error} />);
    expect(screen.getByText(/Error 404/i)).toBeInTheDocument();
  });

  it('should handle an Error instance', () => {
    render(<ErrorState headerTitle="test" error={new Error('Something went wrong')} />);
    expect(screen.getByText(/Error Something went wrong/i)).toBeInTheDocument();
  });

  it('should handle a string error', () => {
    render(<ErrorState headerTitle="test" error="boom" />);
    expect(screen.getByText(/Error boom/i)).toBeInTheDocument();
  });

  it('should handle an arbitrary object error', () => {
    render(<ErrorState headerTitle="test" error={{ code: 42 }} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should handle a null error', () => {
    render(<ErrorState headerTitle="test" error={null} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
