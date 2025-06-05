import React from 'react';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { navigate } from '@openmrs/esm-navigation';
import { ConfigurableLink } from './ConfigurableLink';

vi.mock('single-spa');

const mockNavigate = vi.mocked(navigate);

describe(`ConfigurableLink`, () => {
  afterAll(vi.clearAllMocks);

  const path = '${openmrsSpaBase}/home';
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('interpolates the link', async () => {
    render(
      <ConfigurableLink to={path} className="fancy-link">
        SPA Home
      </ConfigurableLink>,
    );
    const link = screen.getByRole('link', { name: /spa home/i });
    expect(link).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(link.closest('a')).toHaveClass('fancy-link');
    // eslint-disable-next-line testing-library/no-node-access
    expect(link.closest('a')).toHaveAttribute('href', '/openmrs/spa/home');
  });

  it('calls navigate on normal click but not special clicks', async () => {
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

  it('calls navigate on enter', async () => {
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

  it('executes onBeforeNavigate callback on any click that would open the page (including ctrl-click etc)', async () => {
    const onBeforeNavigate = vi.fn();
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
    onBeforeNavigate.mockClear();
    await user.pointer({ target: link, keys: '[MouseRight]' });
    expect(onBeforeNavigate).not.toHaveBeenCalled();
    // Note: This ought to work, but doesn't because of
    //   https://github.com/testing-library/user-event/issues/1083
    //   `event.button` is getting set to 0 when it should be 1.
    // await user.pointer({ target: link, keys: '[MouseMiddle]' });
    // expect(onBeforeNavigate).toHaveBeenCalled();
    // onBeforeNavigate.mockClear();
    await user.pointer({ target: link, keys: '[ControlLeft][MouseLeft][/ControlLeft]' });
    expect(onBeforeNavigate).toHaveBeenCalled();
    onBeforeNavigate.mockClear();
    await user.pointer({ target: link, keys: '[ShiftLeft][MouseLeft][/ShiftLeft]' });
    expect(onBeforeNavigate).toHaveBeenCalled();
  });
});
