import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { navigate } from '@openmrs/esm-navigation';
import { ConfigurableLink } from './ConfigurableLink';

jest.mock('single-spa');

const mockNavigate = navigate as jest.Mock;

describe(`ConfigurableLink`, () => {
  const path = '${openmrsSpaBase}/home';
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it(`interpolates the link`, async () => {
    render(
      <ConfigurableLink to={path} className="fancy-link">
        SPA Home
      </ConfigurableLink>,
    );
    const link = screen.getByRole('link', { name: /spa home/i });
    expect(link).toBeTruthy();
    expect(link.closest('a')).toHaveClass('fancy-link');
    expect(link.closest('a')).toHaveAttribute('href', '/openmrs/spa/home');
  });

  it(`calls navigate on normal click but not special clicks`, async () => {
    render(
      <ConfigurableLink to={path} className="fancy-link">
        SPA Home
      </ConfigurableLink>,
    );
    const user = userEvent.setup();

    const link = screen.getByRole('link', { name: /spa home/i });
    await user.pointer({ target: link, keys: '[MouseRight]' });
    expect(navigate).not.toHaveBeenCalled();
    await user.click(link);
    expect(navigate).toHaveBeenCalledWith({ to: path });
  });

  it(`calls navigate on enter`, async () => {
    render(
      <ConfigurableLink to={path} className="fancy-link">
        SPA Home
      </ConfigurableLink>,
    );
    const user = userEvent.setup();

    expect(navigate).not.toHaveBeenCalled();
    const link = screen.getByRole('link', { name: /spa home/i });
    await user.type(link, '{enter}');
    expect(navigate).toHaveBeenCalledWith({ to: path });
  });

  it('executes onBeforeNavigate callback if provided', async () => {
    const onBeforeNavigate = jest.fn();
    render(
      <ConfigurableLink to={path} onBeforeNavigate={onBeforeNavigate}>
        SPA Home
      </ConfigurableLink>,
    );

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /spa home/i });
    await user.click(link);
    expect(onBeforeNavigate).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith({ to: path });
  });
});
